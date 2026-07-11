import Head from 'next/head';
import { Stack } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import {
  getAllEvents,
  getEventDetails,
  getEventSessions,
  getEventSpeakers,
} from '../../../lib/conferences/eventCall';
import { IEvent, ISpeaker, ISession } from '../../../lib/types';
import { downloadSpeakerImages } from '../../../lib/imageFetcher';
// @ts-ignore
import { EventPoster } from '../../../components/conferences/eventPoster/components';
// @ts-ignore
import { AdvtButtons } from '../../../components/conferences/dayOfEvent/AdvtTool';

interface IEventDisplayPageProps {
  event: { success: boolean; data: IEvent };
  spkdata: ISpeaker[];
  prsession: ISession | null;
}

const EVENT_JOIN_LINKS: Record<string, string> = {
  'GSoC-26-Alumni-Summit': 'https://meet.google.com/snn-vqds-cwf',
};

const EventDisplayPage: React.FC<IEventDisplayPageProps> = ({ event, spkdata, prsession }) => {
  const router = useRouter();
  const { error } = router.query;
  const eventname = event?.data?.name;
  const joinLink = EVENT_JOIN_LINKS[event?.data?.identifier ?? ''];
  
  // Strip HTML tags from description for meta tag
  const metaDescription = event?.data?.description
    ? event.data.description.replace(/<[^>]*>/g, '')
    : '';

  return (
    <div>
      <Head>
        <title>{eventname ? eventname : 'Event Poster'}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content={event?.data?.original_image_url} />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventPoster
            event={event}
            error={error}
            speaker={spkdata}
            prsession={prsession}
            customLink={joinLink}
          />
        </Stack>
        <AdvtButtons repoUrl={'https://github.com/RocketChat/RC4Conferences'} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await getAllEvents();
    const paths = res.data.map((item) => ({
      params: { eid: item.identifier },
    }));
    return {
      paths,
      fallback: false,
    };
  } catch (e) {
    console.error('An error while fetching list of events', e);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const eventIdentifier = context.params?.eid as string;
  
  try {
    const event = await getEventDetails(eventIdentifier);
    const speakersRes = await getEventSpeakers(eventIdentifier);
    
    // Download and localize speaker images
    const localizedSpeakers = await downloadSpeakerImages(speakersRes.data || []);
    
    const sessionsRes = await getEventSessions(eventIdentifier);
    
    // The component expects prsession to be the array of items from the first session object
    let prsession: ISession | null = null;
    if (sessionsRes.data && sessionsRes.data.length > 0) {
      prsession = sessionsRes.data[0];
    }

    return {
      props: { 
          event, 
          spkdata: localizedSpeakers, 
          prsession 
      },
    };
  } catch (e) {
    console.error(`Error in getStaticProps for event ${eventIdentifier}:`, e);
    return {
      notFound: true
    };
  }
};

export default EventDisplayPage;
