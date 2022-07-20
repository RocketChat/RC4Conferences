import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from 'next/router'

function EventEditPage({event}) {
  const router = useRouter()
  const {eid} = router.query
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
          {eid}
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const eventIdentifier = context.query.eid
  //temp 9ddffcbb
    // const res = await getEventDeatils(eventIdentifier)
    // const event = res.data
    return {
      props: { },
    };
  }

export default EventEditPage;
