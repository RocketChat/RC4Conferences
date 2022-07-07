import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from 'next/router'
import { EventCreate } from "../../../components/conferences/create/EventCreate";

function EventCreatePage() {
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
        <h1 className="mx-auto mt-3">Preview of Event Create Component</h1>
        <Stack direction="vertical">
          <EventCreate active={eid} />
        </Stack>
      </div>
    </div>
  );
}

export default EventCreatePage;
