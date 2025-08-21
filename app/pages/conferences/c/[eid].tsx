import Head from 'next/head';
import { Stack } from 'react-bootstrap';
import { useRouter } from 'next/router';
import {
  getAllEvents,
  getEventDeatils,
  getEventSessions,
  getEventSpeakers,
  unsignCook,
} from '../../../lib/conferences/eventCall';
import { fetchAPI } from '../../../lib/api';
import { EventPoster } from '../../../components/conferences/eventPoster/components';
import { AdvtButtons } from '../../../components/conferences/dayOfEvent/AdvtTool';

function EventDisplayPage({ event, spkdata, prsession }) {
  const router = useRouter();
  const { eid, error } = router.query;
  const eventname = event?.data?.name;
  console.log('event', event);
  // Strip HTML tags from description for meta tag
  const metaDescription = event.data.description
    ? event.data.description.replace(/<[^>]*>/g, '')
    : '';

  return (
    <div>
      <Head>
        <title>{eventname ? eventname : 'Event Poster'}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content={event.data.original_image_url} />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventPoster
            event={event}
            error={error}
            speaker={spkdata}
            prsession={prsession}
            customLink={event?.data?.external_event_url}
          />
        </Stack>
        <AdvtButtons repoUrl={'https://github.com/RocketChat/RC4Conferences'} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  let paths = null;
  try {
    const res = await getAllEvents();
    paths = res.data.map((event) => ({
      params: { eid: event.id.toString() },
    }));
    return {
      paths: paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.error('An error while fetching list of events', e);
    return {
      paths: [{ params: { eid: 1, id: 1 } }],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context) {
  const eventIdentifier = context.params.eid;
  const eventId = context.params.id;
  //temp 9ddffcbb
  const event = await getEventDeatils(eventIdentifier);
  const spkdata = await getEventSpeakers(eventIdentifier);
  const getSessions = await getEventSessions(eventIdentifier);
  let prsession = getSessions.data;

  if (!prsession) prsession = null;

  return {
    props: { event, spkdata, prsession },
  };
}

export default EventDisplayPage;
