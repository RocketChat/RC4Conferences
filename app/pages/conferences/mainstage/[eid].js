import Head from 'next/head';

import {
  getAllEvents,
  getEventDetails,
} from '../../../lib/conferences/eventCall';
import { EventMainstage } from '../../../components/conferences/dayOfEvent/mainstage/Mainstage';
import { useState } from 'react';
import styles from '../../../styles/Mainstage.module.css';
import { AdvtButtons } from '../../../components/conferences/dayOfEvent/AdvtTool';

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
      <div className={styles.mainstage_page_wrapper}>
        <div className={styles.mainstage_page_video} style={{ width: '100%' }}>
          <EventMainstage eventdetails={event} open={open} setOpen={setOpen} />
        </div>
        <div className={styles.mainstage_page_chat}>
          {/* <RCdesktopChat open={open} setOpen={setOpen} /> */}
        </div>
      </div>
      <AdvtButtons repoUrl={'https://github.com/RocketChat/RC4Conferences'} />
    </div>
  );
};

export async function getStaticPaths() {
  try {
    const res = await getAllEvents();
    return {
      paths: res.data.map((event) => ({
        params: { eid: event.identifier },
      })),
      fallback: false,
    };
  } catch (e) {
    console.error('An error while fetching list of events', e);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps(context) {
  const eventIdentifier = context.params.eid;
  const event = await getEventDetails(eventIdentifier);

  return {
    props: { eventIdentifier, event },
  };
}

export default EventMainstagePage;
