import Head from "next/head";
import { Stack } from "react-bootstrap";
import { EventCreate } from "../../../components/conferences/create/EventCreate";
import { ssrVerifyAdmin } from "../../../components/conferences/auth/AuthSuperProfileHelper";
import { fetchAPI } from "../../../lib/api";
import { unsignCook } from "../../../lib/conferences/eventCall";
import { EventDashBoard } from "../../../components/conferences/admin/dashboard";

function EventDashBoardPage() {
  return (
    <div>
      <Head>
        <title>Event Create</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <h1 className="mx-auto mt-3">Preview of Event Dashboard</h1>
        <Stack direction="vertical">
          <EventDashBoard />
        </Stack>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {

  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { topNavItems },
    revalidate: 10,
  };
}

export default EventDashBoardPage;
