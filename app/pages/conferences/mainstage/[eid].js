import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import {
  getAllEvents,
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { EventShow } from "../../../components/conferences/display/EventShow";
import { EventMainstage } from "../../../components/conferences/dayOfEvent/mainstage/Mainstage";
import { fetchAPI } from "../../../lib/api";

const EventMainstagePage = ({ event }) => {
  return (
    <div>
      <Head>
        <title>Virtual Conference Main Stage</title>
        <meta
          name="description"
          content="Demonstration main stage for a virtual conference"
        />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventMainstage eventdetails={event} />
        </Stack>
      </div>
    </div>
  );
};

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

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { eventIdentifier, topNavItems, event },
  };
}

export default EventMainstagePage;
