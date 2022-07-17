import Head from "next/head";
import { Stack } from "react-bootstrap";
import { ssrVerifyAdmin } from "../../components/conferences/auth/AuthSuperProfileHelper";
import EventAuth from "../../components/conferences/auth/EveAccountSign";
import { fetchAPI } from "../../lib/api";

function EventAuthPage() {
  return (
    <div>
      <Head>
        <title>Event Auth</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <h1 className="mx-auto mt-3">Preview of Event Auth Component</h1>
        <Stack direction="horizontal">
          <EventAuth />
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const umail = context.req.cookies?.user_mail;
  let isAdmin = false
  if (umail) {
    isAdmin = await ssrVerifyAdmin({email: umail})
  }
  if (!isAdmin) {
    context.res.writeHead(303, { Location: "/" });
    context.res.end();
  }
  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { topNavItems },
  };
}

export default EventAuthPage;
