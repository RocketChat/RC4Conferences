import Head from 'next/head';
import Link from 'next/link';
import { Card, Container } from 'react-bootstrap';
import {
  getAllEvents,
  getEventDetails,
} from '../../../../lib/conferences/eventCall';

function EventEditPage({ event }) {
  return (
    <div>
      <Head>
        <title>Editing Removed</title>
        <meta
          name="description"
          content="The legacy in-browser editing flow is no longer part of the static build."
        />
      </Head>
      <Container className="py-5">
        <Card body>
          <h1 className="h3">{event?.data?.name || 'Event'} editing removed</h1>
          <p className="mb-0">
            The old editor depended on the removed `open-event-server`. Update
            this event through the event server API, then rebuild the static
            frontend.
          </p>
          <div className="mt-3">
            <Link href="/conferences">Back to conferences</Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const response = await getAllEvents();
    return {
      paths: response.data.map((event) => ({
        params: { eid: event.identifier },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error('Failed to prebuild legacy edit pages', error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const event = await getEventDetails(params.eid);
    return {
      props: { event },
    };
  } catch (error) {
    console.error('Failed to load event details', error);
    return { notFound: true };
  }
}

export default EventEditPage;
