import Head from 'next/head';
import Link from 'next/link';
import { Card, Container } from 'react-bootstrap';
import {
  getAllEvents,
  getEventDetails,
} from '../../../lib/conferences/eventCall';

const Greenroom = ({ event }) => {
  return (
    <>
      <Head>
        <title>Greenroom Removed</title>
      </Head>
      <Container className="py-5">
        <Card body>
          <h1 className="h3">
            {event?.data?.name || 'Event'} greenroom is not exported
          </h1>
          <p className="mb-0">
            The old greenroom flow depended on runtime auth and middleware, so
            it has been removed from the static production frontend.
          </p>
          <div className="mt-3">
            <Link href={`/conferences/c/${event?.data?.identifier || ''}`}>
              Back to the event page
            </Link>
          </div>
        </Card>
      </Container>
    </>
  );
};

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
    console.error('Failed to prebuild greenroom pages', error);
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
    console.error('Failed to load greenroom event', error);
    return { notFound: true };
  }
}

export default Greenroom;
