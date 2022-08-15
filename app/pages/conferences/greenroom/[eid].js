import Head from "next/head";
import { useRouter } from 'next/router'
import { getEventDeatils, getEventSpeakers, unsignCook } from "../../../lib/conferences/eventCall";
import { EventSpeakerStage } from "../../../components/conferences/dayOfEvent/greenroom/EventSpeakerRoom";
import { ssrVerifyAdmin } from "../../../components/conferences/auth/AuthSuperProfileHelper";
import { fetchAPI } from "../../../lib/api";
import { verifySpeaker } from "../../../components/conferences/dayOfEvent/helper";

const Greenroom = ({eventIdentifier, isAdmin, spkdata, eventdata}) => {
  return (
    <>
      <Head>
        <title>Conference Green Room</title>
        <link rel="icon" href="../../rocket_gsoc_0" />
      </Head>
      <EventSpeakerStage eventdata={eventdata} isAdmin={isAdmin} spkdata={spkdata} eventIdentifier={eventIdentifier} />
    </>
  );
};

  export async function getServerSideProps(context) {
    const authCookie = context.req.cookies?.event_auth;
    const umail = context.req.cookies?.hashmail;
    const eventIdentifier = context.query.eid
    if (!umail) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const mailres = await unsignCook({
      hash: umail,
    });
    let isAdmin = false;
    if (mailres.data.mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
      isAdmin = await ssrVerifyAdmin({ email: mailres.data.mail });
    }
    const {isSpeaker, spkdata, eventdata} = await verifySpeaker(eventIdentifier, authCookie, mailres)
    
    if (!isAdmin && !isSpeaker) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if(!eventdata && !spkdata) {
      throw new Error("An error in fetching speaker and eventdetails, please check if the Open Event Server is up and running or this particular event doesn't exist yet")
    }
    // const topNavItems = await fetchAPI("/top-nav-item");
  
    return {
      props: { eventIdentifier, isAdmin, spkdata, eventdata },
    };
  }

export default Greenroom;

