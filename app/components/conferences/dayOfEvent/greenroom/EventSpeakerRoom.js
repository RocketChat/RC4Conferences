import Jitsibroadcaster from "../../../clientsideonly/jitsibroadcaster";
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

const RCComponent = dynamic(
  () => import("rc-component-react").then((mod) => mod.RCComponent),
  { ssr: false }
);

export const EventSpeakerStage = ({spkdata, eventdata, eventIdentifier}) => {
  const isSmallScreen = useMediaQuery("(max-width: 790px)");
  const [open, setOpen] = useState(false);

  let isAdmin = false
  
  useEffect(async () => {
    try {
    const hashmail = Cookies.get("hashmail")

    const res = await unsignCook({ hash: hashmail })
    const mail = res.data.mail
    
    if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
      isAdmin = await ssrVerifyAdmin({ email: mail });
    }
  } catch(e) {
    console.error("An error while verifying admin access", e)
  }
  }, [])

  return (
    <div>
      <DoEWrapper>
        <div className={styles.greenroom_jitsi}>
          <Jitsibroadcaster
            room={eventdata ? eventdata.data.attributes?.["chat-room-name"] : `DemoDay-${eventIdentifier}`}
            disName={"Speaker"}
            isAdmin={isAdmin}
          />
          <Collapse in={open}>

          <div
            className={styles.greenroom_root}
          >
              <RCComponent
                moreOpts={true}
                isClosable={true}
                setClosableState={setOpen}
                width="100%"
                height={isSmallScreen ? "30vh": "55vh"}
                GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                host={process.env.NEXT_PUBLIC_RC_URL}
                roomId={'GENERAL'}
                channelName="General"
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
