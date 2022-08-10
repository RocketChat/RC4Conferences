import Jitsibroadcaster from "../../../clientsideonly/jitsibroadcaster";
import styles from "../../../../styles/event.module.css";
import { DoEWrapper } from "../wrapperComponent";
import { SpeakerChatToolbar } from "./SpeakerToolbar";
import { Card, Collapse } from "react-bootstrap";
import { useState } from "react";
import dynamic from "next/dynamic";
// import { RCComponent } from "rc-component-react";

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

export const EventSpeakerStage = ({spkdata, eventdata, isAdmin, eventIdentifier}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DoEWrapper>
        <div className={styles.greenroom_jitsi}>
          <Jitsibroadcaster
            room={eventdata ? eventdata.attributes?.["chat-room-name"] : `${new Date()}-eventIdentifier`}
            disName={"Speaker"}
          />
          <Collapse in={open}>

          <div
            style={{
              width: "30vw",
              marginTop: "15px",
              right: "25px",
              position: "relative"
            }}
          >
              <RCComponent
                moreOpts={true}
                isClosable={true}
                setClosableState={setOpen}
                width="100%"
                height="55vh"
                GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                host={process.env.NEXT_PUBLIC_RC_URL}
                roomId={'CUSTOMERSERVICE'}
                channelName="CustomerService"
                anonymousMode={true}
                isFullScreenFromStart={false}
              />
              <div className={styles.dayofevent_collapsed_button}>
          <SpeakerChatToolbar setOpen={setOpen} open={open} />
        </div> 
          </div>

          </Collapse>
        </div>
        {!open && <div className={styles.dayofevent_button}>
          <SpeakerChatToolbar setOpen={setOpen} open={open} />
        </div>}
      </DoEWrapper>
    </div>
  );
};
