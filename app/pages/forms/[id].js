import Head from 'next/head';
import RCform from '../../components/clientForms/show';
import { getForms } from '../../lib/conferences/eventCall';

export default function FormPage({ formId }) {
  return (
    <div>
      <Head>
        <title>Form</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <RCform formId={formId} />
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const response = await getForms();
    return {
      paths: response.data.map((form) => ({
        params: { id: String(form.id) },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error('Failed to prebuild forms', error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      formId: params.id,
    },
  };
}
