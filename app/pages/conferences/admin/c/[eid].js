import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from "next/router";
import { IndivEventDash } from "../../../../components/conferences/admin/IndivEvent";
import { getEventDeatils } from "../../../../lib/conferences/eventCall";

function EventEditPage({ event }) {
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
        <Stack direction="vertical">
          <IndivEventDash eid={eid} event={event} />
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const authCookie = context.req.cookies?.event_auth;
  const eventIdentifier = context.query.eid;

  if (!authCookie) {
    return {
      redirect: {
        destination: "/conferences",
        permanent: false,
      },
    };
  }
  //temp 9ddffcbb
  const res = await getEventDeatils(eventIdentifier);
  const event = res.data;

  return {
    props: { event },
  };
}

export default EventEditPage;
