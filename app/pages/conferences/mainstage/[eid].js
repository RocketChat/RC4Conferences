import Head from "next/head";

import {
  getAllEvents,
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { EventMainstage } from "../../../components/conferences/dayOfEvent/mainstage/Mainstage";
import { fetchAPI } from "../../../lib/api";
import { useState } from "react";
import { RCdesktopChat } from "../../../components/conferences/dayOfEvent/RCchat";
import styles from "../../../styles/Mainstage.module.css"

const EventMainstagePage = ({ event }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Head>
        <title>Virtual Conference Main Stage</title>
        <meta
          name="description"
          content="Demonstration main stage for a virtual conference"
        />
      </Head>
      <div
        className={styles.mainstage_page_wrapper}
      >
        <div className={styles.mainstage_page_video} style={{ width: "100%" }}>
          <EventMainstage eventdetails={event} open={open} setOpen={setOpen} />
        </div>
        <div
          className={styles.mainstage_page_chat}
        >
          <RCdesktopChat open={open} setOpen={setOpen} />
        </div>
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
  const event = await getEventDeatils(eventIdentifier);

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { eventIdentifier, topNavItems, event },
  };
}

export default EventMainstagePage;
