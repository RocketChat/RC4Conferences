import Head from 'next/head';
import Link from 'next/link';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { getAllEvents } from '../../lib/conferences/eventCall';
import styles from '../../styles/conferences-index.module.css';

const formatDate = (value) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

const formatTime = (value) =>
  new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: true,
  }).format(new Date(value));

const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function ConferencesHome({ events }) {
  const latestEvent = events[0];

  return (
    <div className={styles.page}>
      <Head>
        <title>Conferences</title>
        <meta
          name="description"
          content="Browse published RC4Conferences event pages and upcoming community events."
        />
      </Head>
      <Container className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Rocket.Chat Events</div>
          <h1 className={styles.heroTitle}>Community talks, demos, and alumni stories in one place.</h1>
          <p className={styles.heroText}>
            Browse the latest published event pages and keep the upcoming
            conference lineup close at hand.
          </p>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Published Events</span>
              <span className={styles.metricValue}>{events.length}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Newest Event</span>
              <span className={styles.metricValue}>
                {latestEvent ? formatDate(latestEvent.starts_at) : 'TBD'}
              </span>
            </div>
          </div>
        </section>

        <div className={styles.sectionHeading}>
          <h2>Published conferences</h2>
        </div>

        {events.length === 0 ? (
          <Card body className={styles.emptyState}>
            No events are currently published.
          </Card>
        ) : (
          <Row className={styles.cardGrid}>
            {events.map((event, index) => (
              <Col key={event.id} md={6} xl={4}>
                <Card
                  className={`${styles.eventCard} ${
                    index === 0 ? styles.featuredCard : ''
                  }`}
                >
                  <div
                    className={`${styles.artwork} ${
                      event.original_image_url ? '' : styles.artworkFallback
                    }`}
                    style={
                      event.original_image_url
                        ? { backgroundImage: `url(${event.original_image_url})` }
                        : undefined
                    }
                  >
                    <div className={styles.cardBadge}>
                      {index === 0 ? 'Newest Drop' : 'Event Page'}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaPill}>
                        {formatDate(event.starts_at)}
                      </span>
                      <span className={styles.metaPill}>
                        {`${formatTime(event.starts_at)} - ${formatTime(
                          event.ends_at
                        )} UTC`}
                      </span>
                    </div>
                    <h2 className={styles.eventTitle}>{event.name}</h2>
                    <p className={styles.eventCopy}>
                      {stripHtml(event.description) || 'Published event page.'}
                    </p>
                    <div className={styles.cardFooter}>
                      <Link
                        href={`/conferences/c/${event.identifier}`}
                        className={styles.primaryLink}
                      >
                        View event page
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await getAllEvents();
    const events = [...response.data].sort(
      (left, right) =>
        new Date(right.starts_at).getTime() - new Date(left.starts_at).getTime()
    );

    return {
      props: {
        events,
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
