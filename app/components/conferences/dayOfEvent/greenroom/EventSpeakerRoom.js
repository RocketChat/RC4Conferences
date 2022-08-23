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

export const EventSpeakerStage = ({ spkdata, eventdata, eventIdentifier }) => {
  const isSmallScreen = useMediaQuery("(max-width: 790px)");
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const hashmail = Cookies.get("hashmail");

        const res = await unsignCook({ hash: hashmail });
        const mail = res.data.mail;

        if (mail === process.env.NEXT_PUBLIC_EVENT_ADMIN_MAIL) {
          const isAdminRes = await ssrVerifyAdmin({ email: mail });
          setIsAdmin(isAdminRes)
        }
      } catch (e) {
        console.error("An error while verifying admin access", e);
      }
    };
    verifyAdminAccess();
  }, []);

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
          <Collapse in={open}>
            <div className={styles.greenroom_root}>
              <div className={styles.greenroom_chat_container}>
              <RCComponent
                moreOpts={true}
                isClosable={true}
                setClosableState={setOpen}
                width="auto"
                height={isSmallScreen ? "30vh" : "55vh"}
                GOOGLE_CLIENT_ID={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                host={process.env.NEXT_PUBLIC_RC_URL}
                roomId={
                  process.env.NEXT_PUBLIC_RC_ROOM_ID
                    ? process.env.NEXT_PUBLIC_RC_ROOM_ID
                    : "GENERAL"
                }
                channelName="General"
                anonymousMode={true}
                isFullScreenFromStart={false}
              />
              </div>
              <div className={styles.dayofevent_collapsed_button}>
                <SpeakerChatToolbar setOpen={setOpen} open={open} />
              </div>
            </div>
          </Collapse>
        </div>
        {!open && (
          <div className={styles.dayofevent_button}>
            <SpeakerChatToolbar setOpen={setOpen} open={open} />
          </div>
        )}
      </DoEWrapper>
    </div>
  );
};
