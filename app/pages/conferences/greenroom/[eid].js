import Head from "next/head";
import { useRouter } from "next/router";
import {
  getAllEvents,
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { EventSpeakerStage } from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";
import { fetchAPI } from "../../../lib/api";

const Greenroom = ({ eventIdentifier, spkdata, eventdata }) => {
  
  
  return (
    <>
      <Head>
        <title>Conference Green Room</title>
        <link rel="icon" href="../../rocket_gsoc_0" />
      </Head>
      <EventSpeakerStage
        eventdata={eventdata}
        spkdata={spkdata}
        eventIdentifier={eventIdentifier}
      />
    </>
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
  const eventdata = res.data;

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { eventIdentifier, topNavItems, eventdata },
  };
}

export default Greenroom;
