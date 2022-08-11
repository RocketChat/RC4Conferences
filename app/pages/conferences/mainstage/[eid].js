import Head from "next/head";
import { Stack } from "react-bootstrap";
import { useRouter } from 'next/router'
import { getEventDeatils } from "../../../lib/conferences/eventCall";
import { EventShow } from "../../../components/conferences/display/EventShow";
import { EventMainstage } from "../../../components/conferences/dayOfEvent/mainstage/Mainstage";

const EventMainstagePage = ({event}) => {
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
}

export async function getServerSideProps(context) {
  const eventIdentifier = context.query.eid
  //temp 9ddffcbb
    // const res = await getEventDeatils(eventIdentifier)
    // const event = res.data
    return {
      props: { eventIdentifier },
    };
  }

export default EventMainstagePage;
