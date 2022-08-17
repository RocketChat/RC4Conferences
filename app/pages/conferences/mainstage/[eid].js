import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import {
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

export async function getServerSideProps(context) {
  const eventIdentifier = context.query.eid;
  //temp 9ddffcbb
  // const res = await getEventDeatils(eventIdentifier)
  // const event = res.data
  const umail = context.req.cookies?.hashmail;
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

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(mailres.data.mail)) {
    return {
      redirect: {
        destination: `/conferences/c/${eventIdentifier}`,
        permanent: false,
      },
    };
  }

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { eventIdentifier, topNavItems },
  };
}

export default EventMainstagePage;
