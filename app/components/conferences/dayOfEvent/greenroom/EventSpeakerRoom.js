import styles from "../../../../styles/event.module.css";
import { DoEWrapper } from "../wrapperComponent";
import { SpeakerChatToolbar } from "./SpeakerToolbar";
import { Card, Collapse } from "react-bootstrap";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { ssrVerifyAdmin } from "../../auth/AuthSuperProfileHelper";
import { unsignCook } from "../../../../lib/conferences/eventCall";
import Cookies from "js-cookie";
import Jitsibroadcaster from "./Jitsibroadcaster";

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

const EventSpeakerStage = ({ spkdata, eventdata, eventIdentifier, isAdmin }) => {
  const isSmallScreen = useMediaQuery("(max-width: 790px)");

  return (
    <div>
      <DoEWrapper>
        <div className={styles.greenroom_jitsi}>
          <Jitsibroadcaster
            room={
              eventdata
                ? eventdata.data.attributes?.["chat-room-name"]
                : `DemoDay-${eventIdentifier}`
            }
            disName={"Speaker"}
            isAdmin={isAdmin}
          />
        </div>
      </DoEWrapper>
    </div>
  );
};

export default EventSpeakerStage;
