import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import { EventCreate } from "../../../components/conferences/create/EventCreate";
import { ssrVerifyAdmin } from "../../../components/conferences/auth/AuthSuperProfileHelper";
import { fetchAPI } from "../../../lib/api";
import { unsignCook } from "../../../lib/conferences/eventCall";

function EventCreatePage() {
  const router = useRouter();
  const { eid } = router.query;
  return (
    <div>
      <Head>
        <title>Event Create</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <h1 className="mx-auto mt-3">Preview of Event Create Component</h1>
        <Stack direction="vertical">
          <EventCreate active={eid} />
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const authCookie = context.req.cookies?.event_auth;
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
  let isAdmin = false;
  if (mailres.data.mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    isAdmin = await ssrVerifyAdmin({ email: mailres.data.mail });
  }

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const topNavItems = await fetchAPI("/top-nav-item");
  if (!authCookie) {
    return {
      redirect: {
        destination: "/conferences",
        permanent: false,
      },
    };
  }

  return {
    props: { topNavItems },
  };
}

export default EventCreatePage;
