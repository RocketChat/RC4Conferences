import Head from "next/head";
import { useRouter } from 'next/router'
import { getEventDeatils, unsignCook } from "../../../lib/conferences/eventCall";
import { useState } from "react";
import styles from "../../../styles/Mainstage.module.css";
import { Container, Row, Col } from "react-bootstrap";
import Jitsibroadcaster from "../../../components/clientsideonly/jitsibroadcaster";
import InAppChat from "../../../components/inappchat/inappchat";
import { EventSpeakerStage } from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";
import { ssrVerifyAdmin } from "../../../components/conferences/auth/AuthSuperProfileHelper";
import { fetchAPI } from "../../../lib/api";

const Greenroom = () => {
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

// export async function getServerSideProps(context) {
//   console.log("context", context.query.eid)
//   const eventIdentifier = context.query.eid
//   //temp 9ddffcbb
//     // const res = await getEventDeatils(eventIdentifier)
//     // const event = res.data
//     return {
//       props: { eventIdentifier },
//     };
//   }

  export async function getServerSideProps(context) {
    const authCookie = context.req.cookies?.event_auth;
    const umail = context.req.cookies?.hashmail;
    const eventIdentifier = context.query.eid
    const mailres = await unsignCook({
      hash: umail,
    });
    let isAdmin = false;
    if (mailres.data.mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
      isAdmin = await ssrVerifyAdmin({ email: mailres.data.mail });
    }
    if (!authCookie) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const topNavItems = await fetchAPI("/top-nav-item");
  
    return {
      props: { topNavItems, eventIdentifier, isAdmin },
    };
  }

export default Greenroom;

