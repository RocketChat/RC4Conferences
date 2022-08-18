import { useEffect, useState } from "react";
import { Button, Col, Collapse, Container } from "react-bootstrap";
import Videostreamer from "../../../clientsideonly/videostreamer";
import { SpeakerChatToolbar } from "../greenroom/SpeakerToolbar";
import { DoEWrapper } from "../wrapperComponent";

import styles from "../../../../styles/event.module.css";
import dynamic from "next/dynamic";
import { getIPInfo } from "../../../../lib/geoAPI";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";


const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

const asiaLink = process.env.NEXT_PUBLIC_SERVER_STREAM_LINK0;
const otherLink = process.env.NEXT_PUBLIC_SERVER_STREAM_LINK1;

export const EventMainstage = ({ eventdetails }) => {
  const isSmallScreen = useMediaQuery("(max-width: 790px)");
  const [open, setOpen] = useState(isSmallScreen);
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
    <DoEWrapper>
      <div className={styles.mainstage_root}>
        <Videostreamer
          poster={evePoster ? evePoster : "/gsocsmall.jpg"}
          src={streamLink}
          type="application/vnd.apple.mpegurl"
          region={region}
        />
        <Collapse in={open}>
          <div className={styles.mainstage_chatwindow}>
            <RCComponent
              moreOpts={true}
              isClosable={true}
              setClosableState={setOpen}
              width={isSmallScreen ? "100%": "fit-content"}
              height={isSmallScreen ? "30vh": "55vh"}
              GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              host={process.env.NEXT_PUBLIC_RC_URL}
              roomId={"GENERAL"}
              channelName="General"
              anonymousMode={true}
              isFullScreenFromStart={false}
            />
          </div>
        </Collapse>
        <div className={styles.mainstage_chattool}>
          <SpeakerChatToolbar setOpen={setOpen} open={open} />
        </div>
      </div>
    </DoEWrapper>
  );
};
