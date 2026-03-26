import Head from 'next/head';
import Link from 'next/link';
import { Card, Container } from 'react-bootstrap';

function EventDashBoardPage() {
  return (
    <div>
      <Head>
        <title>Dashboard Removed</title>
        <meta
          name="description"
          content="The legacy browser dashboard has been removed from the static build."
        />
      </Head>
      <Container className="py-5">
        <Card body>
          <h1 className="h3">Legacy dashboard removed</h1>
          <p className="mb-0">
            Event creation and editing are no longer handled inside the static
            Next.js app. Use the event server API or seed scripts to manage
            content.
          </p>
          <div className="mt-3">
            <Link href="/conferences">Back to conferences</Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default EventDashBoardPage;
