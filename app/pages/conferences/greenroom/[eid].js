import Head from "next/head";
import { useRouter } from "next/router";
import {
  getAllEvents,
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { fetchAPI } from "../../../lib/api";
import EventSpeakerStage from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RCdesktopChat } from "../../../components/conferences/dayOfEvent/RCchat";
import styles from "../../../styles/Greenroom.module.css"


const Greenroom = ({ eventIdentifier, spkdata, eventdata }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Conference Green Room</title>
        <link rel="icon" href="../../rocket_gsoc_0" />
      </Head>
      <div className={styles.greenroom_page_wrapper}>
        <div className={styles.greenroom_page_video}>
          <EventSpeakerStage
            eventdata={eventdata}
            spkdata={spkdata}
            eventIdentifier={eventIdentifier}
            setOpen={setOpen}
            open={open}
          />
        </div>
        <div
          className={styles.greenroom_page_chat}
        >
          <RCdesktopChat open={open} setOpen={setOpen} />
        </div>
      </div>
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
  const eventdata = await getEventDeatils(eventIdentifier);

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { eventIdentifier, topNavItems, eventdata },
  };
}

export default Greenroom;
