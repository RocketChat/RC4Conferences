import Head from "next/head";
import { ProgressBar, Stack } from "react-bootstrap";
import EventHome from "../../components/conferences/EventHome";
import Image from "next/image";
import eventLogo from "../../../assets/event_logo.svg";
import styles from "../../styles/event.module.css";
import { generatePassword } from "../../components/conferences/auth/AuthHelper";
import { fetchAPI } from "../../lib/api";
import { ssrVerifyAdmin } from "../../components/conferences/auth/AuthSuperProfileHelper";
import Cookies from "js-cookie";

function EventHomeDemo({ imgUrl, passcode }) {

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
              <EventHome passcode={passcode} />
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
  const umail = context.req.cookies?.user_mail;
  let passcode = null;
  let isAdmin = false
  if (umail) {
    passcode = await generatePassword(umail);
    isAdmin = await ssrVerifyAdmin({email: umail})
  }
  if (!isAdmin) {
    context.res.writeHead(303, { Location: "/" });
    context.res.end();
  }
  const topNavItems = await fetchAPI("/top-nav-item");

  return {
    props: { imgUrl, passcode, topNavItems },
  };
}

export default EventHomeDemo;
