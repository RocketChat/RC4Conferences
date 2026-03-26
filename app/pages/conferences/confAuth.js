import Head from 'next/head';
import Link from 'next/link';
import { Card, Container } from 'react-bootstrap';

function EventAuthPage() {
  return (
    <div>
      <Head>
        <title>Legacy Admin Auth Removed</title>
        <meta
          name="description"
          content="Legacy browser-based event auth has been removed from the static frontend."
        />
      </Head>
      <Container className="py-5">
        <Card body>
          <h1 className="h3">Legacy admin auth has been removed</h1>
          <p className="mb-3">
            The old browser-based admin flow depended on the removed
            `open-event-server`. The production frontend is now a static,
            public-facing site.
          </p>
          <p className="mb-0">
            Manage events through the event server API and seeding scripts, then
            rebuild the static site to publish changes.
          </p>
          <div className="mt-3">
            <Link href="/conferences">Back to conferences</Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default EventAuthPage;
