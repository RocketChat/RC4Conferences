import Head from "next/head";
import { useRouter } from 'next/router'
import { getEventDeatils } from "../../../lib/conferences/eventCall";
import { useState } from "react";
import styles from "../../../styles/Mainstage.module.css";
import { Container, Row, Col } from "react-bootstrap";
import Jitsibroadcaster from "../../../components/clientsideonly/jitsibroadcaster";
import InAppChat from "../../../components/inappchat/inappchat";
import { EventSpeakerStage } from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";

const Greenroom = () => {
  const [openChat, setOpenChat] = useState(false);
  const router = useRouter();
  const { eid } = router.query;

  return (
    <>
      <Head>
        <title>Conference Green Room</title>
        <link rel="icon" href="../../rocket_gsoc_0" />
      </Head>
      <EventSpeakerStage />
    </>
  );
};

export async function getServerSideProps(context) {
  console.log("context", context.query.eid)
  const eventIdentifier = context.query.eid
  //temp 9ddffcbb
    // const res = await getEventDeatils(eventIdentifier)
    // const event = res.data
    return {
      props: { eventIdentifier },
    };
  }

export default Greenroom;

