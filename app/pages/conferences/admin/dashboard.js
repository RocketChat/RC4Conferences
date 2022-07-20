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

export async function getServerSideProps(context) {
  const authCookie = context.req.cookies?.event_auth;
  const umail = context.req.cookies?.hashmail;
  const mailres = await unsignCook({
    hash: umail,
  });
  let isAdmin = false;
  if (mailres.data.mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    isAdmin = await ssrVerifyAdmin({ email: mailres.data.mail });
  }
  if (!isAdmin) {
    context.res.writeHead(303, { Location: "/" });
    context.res.end();
  }
  if (!authCookie) {
    context.res.writeHead(303, { Location: "/conferences" });
    context.res.end();
  }
  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { topNavItems },
  };
}

export default EventDashBoardPage;
