import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import styles from "../../../styles/event.module.css";

import { MdEventSpeaker, SmEventSpeaker } from "./EventSpeaker";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { MdEventHeader, SmEventHeader } from "./EventHeader";
import Cookies from "js-cookie";
import { unsignCook } from "../../../lib/conferences/eventCall";

export const EventShow = ({ event }) => {
  const [key, setKey] = useState("home");
  const isSmallScreen = useMediaQuery("(max-width: 576px)");
  const [isSignedIn, setIsSignedIn] = useState(false)

  const isMdScreen = useMediaQuery("(min-width: 768px)");

  useEffect(async () => {

    try {
      const hashmail = Cookies.get("hashmail")
  
      const res = await unsignCook({ hash: hashmail })
      const mail = res.data.mail

      
      const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (emailRegex.test(mail)) {
      setIsSignedIn(true)
    }
    } catch(e) {
      console.error("An error while verifying admin access", e)
    }    
  }, [])


  return (
    <Card className={styles.event_show_root}>
      {isMdScreen ? (
        <MdEventHeader event={event} isSignedIn={isSignedIn} />
      ) : (
        <SmEventHeader event={event} isSignedIn={isSignedIn} />
      )}
      <div className={styles.event_nav}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className={styles.event_nav_header}
          fill
        >
          <Tab eventKey="home" title="Overview">
            <Stack>
              <EventDesc eventData={event.data} />
              <div className={styles.event_logo}>
                <Image src={event.data.attributes["logo-url"]} width={100} />
              </div>
            </Stack>
          </Tab>
          <Tab eventKey="sessions" title="Sessions"></Tab>
          <Tab eventKey="speakers" title="Speakers">
            {key == "speakers" &&
              (isSmallScreen ? (
                <SmEventSpeaker eid={event.data.attributes.identifier} />
              ) : (
                <MdEventSpeaker eid={event.data.attributes.identifier} />
              ))}
          </Tab>
        </Tabs>
      </div>
    </Card>
  );
};

const EventDesc = ({ eventData }) => {
  let eventDesc = eventData.attributes.description;
  eventDesc = eventDesc.replace(/(<([^>]+)>)/gi, "");

  return (
    <Container className={styles.event_desc}>
      <Row>
        <Col>
          <div>
            <h6>About the Event</h6>
            <p>{eventDesc}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
