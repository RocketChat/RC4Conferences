import { Badge, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import styles from "../../../../styles/Videostreamer.module.css";
import Script from "next/script";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Videostreamer(props) {
  const [ping, setPing] = useState(false);
  const [message, setMessage] = useState(
    "Thanks for joining in! Please start the stream."
  );

  const handleToast = () => {
    setPing(true);
  };

  const handleWait = () => {
    setPing(false);
    setMessage("Thanks for watching! Stream will be back soon.");
  };

  const handleStall = () => {
    setPing(false);
    setMessage("Thanks for watching! Failed to fetch data, but trying.");
  };

  const handleProgress = () => {
    setPing(true);
  };

  const handleError = () => {
    setPing(false);
    setMessage(
      "Thanks for watching! Stream is not available. Please try again later or contact organizer."
    );
  };

  const handleLoad = () => {
    setPing(true);
  };

  return (
    <>
      <Head>
        <link
          href="https://vjs.zencdn.net/7.17.0/video-js.css"
          rel="stylesheet"
        />
      </Head>
      <Script
        src="https://vjs.zencdn.net/7.17.0/video.min.js"
        strategy="afterInteractive"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <Col className={styles.video_root}>
        <div className={styles.video_server}>
          <Badge pill bg={"warning"} text={"black"}>
            {props.region}
          </Badge>
        </div>
        <video
          autoPlay={true}
          id={styles.my_video}
          className="video-js vjs-big-play-centered vjs-responsive"
          controls
          preload="auto"
          poster={props.poster}
          data-setup='{}'
          onError={handleError}
          onProgress={handleProgress}
          onLoadedData={handleLoad}
          onWaiting={handleWait}
          onStalled={handleStall}
        >
          <source src={props.src} type={props.type}></source>
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading
            to a web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
            </a>
          </p>
        </video>
        <Alert show={!ping} handleToast={handleToast} message={message} />
      </Col>
    </>
  );
}

const Alert = ({ handleToast, show, message }) => {
  return (
    <ToastContainer
      position="bottom-start"
      style={{ zIndex: "10" }}
      className="p-3"
    >
      <Toast
        show={show}
        onClose={handleToast}
        delay={60000}
        autohide
        bg="warning"
      >
        <Toast.Header>
          <strong className="me-auto">Stream Alert!</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
