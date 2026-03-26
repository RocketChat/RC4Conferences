import Head from 'next/head';
import styles from '../styles/Home.module.css';
// @ts-ignore
import Infotiles from '../components/infotiles';
// @ts-ignore
import Newscarousel from '../components/newscarousel';
// @ts-ignore
import Personacircle from '../components/personalcircle';
// @ts-ignore
import Searchbox from '../components/searchbox';
// @ts-ignore
import Growthcounters from '../components/growthcounters';
import { Container, Col } from 'react-bootstrap';
import { fetchAPI } from '../lib/api';
import { INFOTILES_DATA } from '../lib/const/infotiles';
import { GetStaticProps } from 'next';
import { ICarousel, IPersona, IGuide, IReleaseNote } from '../lib/types';

interface IHomeProps {
  carousels: { data: ICarousel[] };
  personas: { data: IPersona[] };
  guides: { data: IGuide | null };
  releaseNotes: { data: IReleaseNote | null };
}

const Home: React.FC<IHomeProps> = (props) => {
  return (
    <>
      <Head>
        <title>Rocket.Chat: Communications Platform You Can Fully Trust</title>
        <meta
          name="description"
          content="Rocket.Chat is a Communications Platform You Can Fully Trust"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        fluid
        className="d-flex flex-column align-items-center gap-3 gap-md-5"
      >
        <Col className="d-flex flex-column align-items-center gap-2 py-5 mt-2">
          <h1
            className={`display-4 fw-bold text-center ${styles.hero_heading}`}
          >
            Welcome to our <span className={styles.redText}>community</span>
          </h1>
          <p
            className={`fw-regular col-10 col-md-8 text-center ${styles.hero_subheading}`}
          >
            Let&apos;s dream, share, and collaborate in shaping the future of
            the Rocket.Chat ecosystem together
          </p>
        </Col>
        <Col className="mb-5 d-flex flex-column align-items-center">
          <h6 className="py-2 fs-6">
            {' '}
            <a
              href={props?.guides?.data?.location}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the Guides
            </a>{' '}
            |{' '}
            <a
              href={props?.releaseNotes?.data?.location}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Release Notes
            </a>{' '}
          </h6>
          <Searchbox></Searchbox>
        </Col>
        <Col>
          <Growthcounters></Growthcounters>
        </Col>
        <Col className="my-5">
          <div className={styles.infotiles}>
            <Infotiles data={INFOTILES_DATA} />
          </div>
        </Col>

        <div className={`d-flex flex-column py-5 ${styles.community_news}  `}>
          <h2 className={`mx-auto  w-auto pb-5 ${styles.title}`}>
            Latest Community News
          </h2>
          <Newscarousel carousels={props.carousels.data}></Newscarousel>
        </div>

        <h2 className={`mx-auto w-auto m-5 ${styles.title}`}>
          Get What You Need...
        </h2>
        <Personacircle personas={props.personas.data}></Personacircle>

        <div className={` d-flex w-100 flex-column py-5 align-items-center`}>
          <h2 className={`mx-auto w-auto m-2 ${styles.title}`}>
            Community Activity
          </h2>
        </div>
      </Container>
    </>
  );
};

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    return await fetchAPI<T>(path);
  } catch (error) {
    console.warn(`Failed to fetch ${path}`, error);
    return fallback;
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const carousels = await safeFetch('/carousels', { data: [] as ICarousel[] });
  const personas = await safeFetch('/personas', { data: [] as IPersona[] });
  const guides = await safeFetch('/guide', { data: null as IGuide | null });
  const releaseNotes = await safeFetch('/release-note', {
    data: null as IReleaseNote | null,
  });

  return {
    props: {
      carousels,
      personas,
      guides,
      releaseNotes,
    },
  };
};

export default Home;
