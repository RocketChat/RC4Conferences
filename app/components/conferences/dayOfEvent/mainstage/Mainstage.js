import { useState } from "react";
import { Button, Col, Collapse, Container } from "react-bootstrap";
import Videostreamer from "../../../clientsideonly/videostreamer";
import { SpeakerChatToolbar } from "../greenroom/SpeakerToolbar";
import { DoEWrapper } from "../wrapperComponent";

import styles from "../../../../styles/event.module.css";
import dynamic from "next/dynamic";

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

const asiaLink = process.env.NEXT_PUBLIC_SERVER_STREAM_LINK0;

export const EventMainstage = ({ eventdetails }) => {
  const [open, setOpen] = useState(false);

  return (
    <DoEWrapper>
      <div style={{ display: "flex" }}>
        <Videostreamer
          poster="/gsocsmall.jpg"
          src={"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
          type="application/vnd.apple.mpegurl"
        />

          <Collapse in={open}>
            <div
              className={styles.mainstage_chatwindow}
            >
              <RCComponent
                moreOpts={true}
                isClosable={true}
                setClosableState={setOpen}
                width="100%"
                height="60vh"
                GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                host={process.env.NEXT_PUBLIC_RC_URL}
                roomId={"CUSTOMERSERVICE"}
                channelName="Customer"
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
