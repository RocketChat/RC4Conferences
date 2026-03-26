import Head from 'next/head';
import Link from 'next/link';
import { Card, Container } from 'react-bootstrap';

function EventCreatePage({ step }) {
  return (
    <div>
      <Head>
        <title>Creation Removed</title>
        <meta
          name="description"
          content="The legacy in-browser event creation flow has been removed from the static build."
        />
      </Head>
      <Container className="py-5">
        <Card body>
          <h1 className="h3">Legacy creation step: {step}</h1>
          <p className="mb-0">
            Event authoring now happens outside the static frontend. Use the
            event server API and seeding scripts, then rebuild the site.
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
  return {
    paths: [
      { params: { eid: 'basic-detail' } },
      { params: { eid: 'session' } },
      { params: { eid: 'other-details' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      step: params.eid,
    },
  };
}

export default EventCreatePage;
