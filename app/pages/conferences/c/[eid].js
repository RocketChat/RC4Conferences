import Head from 'next/head';
import { Stack } from 'react-bootstrap';
import { useRouter } from 'next/router';
import {
  getAllEvents,
  getEventDeatils,
  getEventSpeakers,
  unsignCook,
} from '../../../lib/conferences/eventCall';
import { fetchAPI } from '../../../lib/api';
import { EventPoster } from '../../../components/conferences/eventPoster/components';
import { AdvtButtons } from "../../../components/conferences/dayOfEvent/AdvtTool";

function EventDisplayPage({ event, spkdata, prsession }) {
  const router = useRouter();
  const { eid, error } = router.query;
  const eventname = event?.data?.attributes?.name;
  return (
    <div>
      <Head>
        <title>{eventname ? eventname : 'Event Poster'}</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventPoster
            event={event}
            error={error}
            speaker={spkdata}
            prsession={prsession}
            customLink={'/conferences/c/' + eid}
          />
        </Stack>
        <AdvtButtons repoUrl={"https://github.com/RocketChat/RC4Conferences"} />

      </div>
    </div>
  );
}

export async function getStaticPaths() {
  let paths = null;
  try {
    const res = await getAllEvents();
    paths = res.data.data.map((event) => ({
      params: { eid: event.attributes.identifier },
    }));
    return {
      paths: paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.error('An error while fetching list of events', e);
    return {
      paths: [{ params: { eid: 1 } }],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context) {
  const eventIdentifier = context.params.eid;
  //temp 9ddffcbb
  const event = await getEventDeatils(eventIdentifier);

  const spkdata = await getEventSpeakers(eventIdentifier);

  const topNavItems = await fetchAPI('/top-nav-item');

  const sessionRes = await fetchAPI(
    `/event-sessions?populate=session_items&filters[event_id][$eq]=${event?.data?.id}`
  );
  let prsession = sessionRes.data[0];

  if (!prsession) prsession = null;

  return {
    props: { topNavItems, event, spkdata, prsession },
  };
}

export default EventDisplayPage;
