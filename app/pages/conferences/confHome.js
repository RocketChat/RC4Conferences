import Head from "next/head";
import { Stack } from "react-bootstrap";
import EventAuth from "../../components/conferences/auth/EveAccountSign";

function EventHomeDemo() {
  return (
    <div>
      <Head>
        <title>Form</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <h1 className="mx-auto mt-3">Preview of Event Component</h1>
        <Stack direction="horizontal">
          <EventAuth />
        </Stack>
      </div>
    </div>
  );
}

export default EventHomeDemo;
