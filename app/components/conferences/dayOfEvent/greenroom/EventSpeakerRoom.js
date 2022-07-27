import Jitsibroadcaster from "../../../clientsideonly/jitsibroadcaster";
import styles from "../../../../styles/event.module.css";
import { DoEWrapper } from "../wrapperComponent";
import { SpeakerChatToolbar } from "./SpeakerToolbar";
import { Card, Collapse } from "react-bootstrap";
import { useState } from "react";

export const EventSpeakerStage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DoEWrapper>
        <div className={styles.greenroom_jitsi}>
          <Jitsibroadcaster
            room={"GSOC Alumnus Meet Test"}
            disName={"Speaker"}
          />
          <Collapse in={open}>

          <Card
            style={{
              width: "18rem",
              marginTop: "15px",
              right: "25px",
            }}
          >
            <Card.Body>
              <Card.Title>Chat PlaceHolder</Card.Title>
              <Card.Text>
                The Chat would appear in here, this window is just an
                placeholder until we integrate the RocketChat Mini Chat
              </Card.Text>
            </Card.Body>
          </Card>
          </Collapse>
        </div>
        <div className={styles.dayofevent_button}>
          <SpeakerChatToolbar setOpen={setOpen} open={open} />
        </div>
      </DoEWrapper>
    </div>
  );
};
