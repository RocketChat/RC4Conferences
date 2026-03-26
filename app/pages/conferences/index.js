import Head from 'next/head';
import Link from 'next/link';
import { Card, Container, Stack } from 'react-bootstrap';
import { getAllEvents } from '../../lib/conferences/eventCall';
import styles from '../../styles/event.module.css';

function ConferencesHome({ events }) {
  return (
    <div>
      <Head>
        <title>Conferences</title>
        <meta
          name="description"
          content="Browse published RC4Conferences event pages."
        />
      </Head>
      <Container className="py-5">
        <Stack gap={3}>
          <div>
            <h1 className="mb-2">Published conferences</h1>
            <p className="text-muted mb-0">
              The production frontend now serves public event pages only.
              Content management happens through the event server API and seed
              tooling.
            </p>
          </div>
          {events.length === 0 ? (
            <Card body>No events are currently published.</Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} body className={styles.event_card}>
                <h2 className="h4 mb-2">{event.name}</h2>
                <p className="mb-3 text-muted">
                  {event.starts_at} to {event.ends_at}
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link href={`/conferences/c/${event.identifier}`}>
                    View event page
                  </Link>
                  <Link href={`/conferences/mainstage/${event.identifier}`}>
                    View mainstage
                  </Link>
                </div>
              </Card>
            ))
          )}
        </Stack>
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await getAllEvents();
    return {
      props: {
        events: response.data,
      },
    };
  } catch (error) {
    console.error('Failed to load conference list', error);
    return {
      props: {
        events: [],
      },
    };
  }
}

export default ConferencesHome;
