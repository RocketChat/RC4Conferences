import { useEffect, useState } from "react";
import { Button, Col, Collapse, Container } from "react-bootstrap";
import Videostreamer from "./videostreamer";
// import { SpeakerChatToolbar } from "../greenroom/SpeakerToolbar";
import { DoEWrapper } from "../wrapperComponent";

import styles from "../../../../styles/event.module.css";
import dynamic from "next/dynamic";
import { getIPInfo } from "../../../../lib/geoAPI";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { EventHeader } from "../greenroom/EventHeader";

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

const asiaLink = process.env.NEXT_PUBLIC_SERVER_STREAM_LINK0;
const otherLink = process.env.NEXT_PUBLIC_SERVER_STREAM_LINK1;

export const EventMainstage = ({ eventdetails, open, setOpen }) => {
  const isSmallScreen = useMediaQuery("(max-width: 790px)");
  // const [open, setOpen] = useState(isSmallScreen);
  const [streamLink, setStreamLink] = useState(asiaLink);
  const [region, setRegion] = useState("Asia");
  const evePoster = eventdetails?.data?.attributes?.["original-image-url"];

  useEffect(async () => {
    try {
      const res = await getIPInfo();
      const ipInfo = res.data;
      if (ipInfo.timezone.split("/")[0] == "Asia") {
        setStreamLink(asiaLink);
        setRegion(ipInfo.timezone.split("/")[0]);
      } else {
        setStreamLink(otherLink);
        setRegion(ipInfo.timezone.split("/")[0]);
      }
    } catch (e) {
      console.error("error in ip allocation switching to Asia server", e);
    }
  }, []);

  return (
      <div className={styles.mainstage_root}>
        <EventHeader eventData={eventdetails} open={open} setOpen={setOpen} />
        <Videostreamer
          poster={evePoster ? evePoster : "/gsocsmall.jpg"}
          src={streamLink}
          type="application/vnd.apple.mpegurl"
          region={region}
        />
      </div>
  );
};
