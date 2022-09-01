import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import {
  getAllEvents,
  getEventDeatils,
  getEventSpeakers,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { EventShow } from "../../../components/conferences/display/EventShow";
import { fetchAPI } from "../../../lib/api";

function EventDisplayPage({ event, spkdata, prsession }) {
  const router = useRouter();
  const { eid, error } = router.query;
  const eventname = event?.data?.attributes?.name;
  return (
    <div>
      <Head>
        <title>{eventname ? eventname : "Event Poster"}</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventShow event={event} error={error} speaker={spkdata} prsession={prsession} />
        </Stack>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  let paths = null;
  try {
    const res = await getAllEvents();
    paths = res.data.data.map((event) => ({
      params: { eid: event.id },
    }));
    return {
      paths: paths,
      fallback: "blocking", 
    };
  } catch (e) {
    console.error("An error while fetching list of events", e);
    return {
      paths: [{ params: { eid: 1 } }],
      fallback: "blocking", 
    };
  }
}

export async function getStaticProps(context) {
  const eventIdentifier = context.params.eid;
  //temp 9ddffcbb
  const res = await getEventDeatils(eventIdentifier);
  const event = res.data;

  const spkdata = await getEventSpeakers(eventIdentifier);


  const topNavItems = await fetchAPI("/top-nav-item");

  const sessionRes = await fetchAPI("/sessions?sort[0]=start_time")
  const prsession = sessionRes.data

  return {
    props: { topNavItems, event, spkdata, prsession },
  };
}

export default EventDisplayPage;
