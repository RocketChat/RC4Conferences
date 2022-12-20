import Head from "next/head";
import { useRouter } from "next/router";
import {
  getAllEvents,
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { fetchAPI } from "../../../lib/api";
import EventSpeakerStage from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";
import { ssrVerifyAdmin } from "../../../components/conferences/auth/AuthSuperProfileHelper";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Greenroom = ({ eventIdentifier, spkdata, eventdata }) => {

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const hashmail = Cookies.get("hashmail");

        const res = await unsignCook({ hash: hashmail });
        const mail = res.mail;

        if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
          const isAdminRes = await ssrVerifyAdmin({ email: mail });
          console.log("is admin", isAdminRes)
          setIsAdmin(isAdminRes)
        }
      } catch (e) {
        console.error("An error while verifying admin access", e);
      }
    };
    verifyAdminAccess();
  }, []);
  
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
        isAdmin={isAdmin}
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
