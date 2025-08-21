import Head from "next/head";
import { ProgressBar, Stack } from "react-bootstrap";
import EventHome from "../../components/conferences/EventHome";
import Image from "next/image";
import eventLogo from "../../assets/event_logo.svg";
import styles from "../../styles/event.module.css";
import { generatePassword } from "../../components/conferences/auth/AuthHelper";
import { ssrVerifyAdmin } from "../../components/conferences/auth/AuthSuperProfileHelper";
import { unsignCook } from "../../lib/conferences/eventCall";

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
              <Image width={300} height={250} src={eventLogo} alt="Event logo" />
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
  const umail = context.req.cookies?.hashmail;
  if (!umail) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      },
    }
  }
  const mailres = await unsignCook({
    hash: umail
  })
  const imgUrl = res.url;
  let passcode = null;
  let isAdmin = false
  if (mailres.mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
    passcode = await generatePassword(mailres.mail);
    isAdmin = await ssrVerifyAdmin({email: mailres.mail})
  }
  
  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      },
    }
  }
  
  return {
    props: { imgUrl, passcode },
  };
}

export default EventHomeDemo;
