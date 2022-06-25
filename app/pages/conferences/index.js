import Cookies from "js-cookie";
import Head from "next/head";
import { Stack } from "react-bootstrap";
import EventAuth from "../../components/conferences/auth/EveAccountSign";
import EventHome from "../../components/conferences/EventHome";
import Image from "next/image";
import eventLogo from "../../../assets/event_logo.svg";
import styles from "../../styles/event.module.css";

function EventHomeDemo({ imgUrl }) {
  return (
    <div>
      <Head>
        <title>Form</title>
        <meta name="description" content="Rocket.Chat form tool demo" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="mx-auto">
        <Stack direction="vertical">
          <div
            style={{ backgroundImage: `url(${imgUrl})` }}
            className={styles.home_bg}
          >
            <div className={styles.home_bg_content}>
            <Image width={300} height={250} src={eventLogo} />
            <EventHome />
            </div>
            
          </div>
        </Stack>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(
    "https://source.unsplash.com/random/1920x1080/?event,online,teamwork"
  );
  const imgUrl = res.url;
  return {
    props: { imgUrl },
  };
}

export default EventHomeDemo;
