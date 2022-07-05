import { useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Row,
  Stack,
  Tab,
  TabContent,
  Tabs,
} from "react-bootstrap";
import styles from "../../../styles/event.module.css";

import { MdEventSpeaker, SmEventSpeaker } from "./EventSpeaker";
import { useMediaQueries, useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { MdEventHeader, SmEventHeader } from "./EventHeader";

export const EventShow = ({ event }) => {
  const [key, setKey] = useState("home");
  const isSmallScreen = useMediaQuery("(max-width: 576px)");
  
  const isMdScreen = useMediaQuery("(min-width: 768px)");
  

  return (
    <Card className={styles.event_show_root}>
      {isMdScreen ? <MdEventHeader event={event} /> :<SmEventHeader event={event} />}
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
              <Image src={event.data.attributes["logo-url"]} width={100} />
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
