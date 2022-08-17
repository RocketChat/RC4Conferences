import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import {
  getEventDeatils,
  unsignCook,
} from "../../../lib/conferences/eventCall";
import { EventShow } from "../../../components/conferences/display/EventShow";
import { fetchAPI } from "../../../lib/api";

function EventDisplayPage({ event, isSignedIn }) {
  const router = useRouter();
  const { eid } = router.query;
  const eventname = event?.data?.attributes?.name;
  return (
    <div>
      <Head>
        <title>{eventname ? eventname : "Event Poster"}</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <EventShow event={event} isSignedIn={isSignedIn} />
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const eventIdentifier = context.query.eid;
  let isSignedIn = false;
  const umail = context.req.cookies?.hashmail;
  let mailres = null;
  if (umail) {
    mailres = await unsignCook({
      hash: umail,
    });
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (emailRegex.test(mailres.data.mail)) {
      isSignedIn = true;
    }
  }

  //temp 9ddffcbb
  const res = await getEventDeatils(eventIdentifier);
  const event = res.data;
  const topNavItems = await fetchAPI("/top-nav-item");
  return {
    props: { event, isSignedIn, topNavItems },
  };
}

export default EventDisplayPage;
