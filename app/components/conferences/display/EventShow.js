import { useState } from "react";
import {
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
import { BsCalendar2Event, BsInfoCircle } from "react-icons/bs";
import {GoLocation} from "react-icons/go"
import { EventSpeaker } from "./EventSpeaker";

export const EventShow = ({ event }) => {
  const [key, setKey] = useState("home");
  console.log("even", event);

  return (
    <div>
      <div className={styles.event_banner}>
        <Image src={event.data.attributes["original-image-url"]} fluid />
        <div className={styles.event_banner_title}>
          {/* <img src={event.data.attributes["logo-url"]} width={100} /> */}
          <h4>{event.data.attributes.name}</h4>
          <p>by <span style={{color: "#d6162f"}}>{event.data.attributes["owner-name"]}</span></p>
          <hr />
          <Stack gap={3}>
          <EventDate eventData={event.data} />
          <EventLocation eventData={event.data} />
          </Stack>
        </div>
      </div>
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
          <Tab eventKey="profile" title="Sessions">
            
          </Tab>
          <Tab eventKey="contact" title="Speakers">
          <EventSpeaker eid={event.data.attributes.identifier} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const EventDate = ({ eventData }) => {
  let start = eventData.attributes["starts-at"];
  let end = eventData.attributes["ends-at"];
  start = `${new Date(start).toDateString()} ${new Date(
    start
  ).toLocaleTimeString()}`;
  end = `${new Date(end).toDateString()} ${new Date(end).toLocaleTimeString()}`;

  return (
    <Container>
      <Row>
        <Col xs={1}>
          <BsCalendar2Event />
        </Col>
        <Col>
          <div className={styles.event_date}>
            <h6>
              Date and Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </h6>
            <span>{start + " - "}</span>
            <span>{end}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const EventLocation = ({ eventData }) => {

  const location = eventData.attributes["location-name"]

  return (
    <Container>
      <Row>
        <Col xs={1}>
          <GoLocation />
        </Col>
        <Col>
          <div className={styles.event_date}>
            <h6>
              Location
            </h6>
            {location ? location : "Online" }
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const EventDesc = ({ eventData }) => {

  let eventDesc = eventData.attributes.description;
  eventDesc = eventDesc.replace(/(<([^>]+)>)/gi, "");

  return (
    <Container className={styles.event_desc}>
      <Row>
        <Col>
          <div >
            <h6>About the Event</h6>
            <p>
              {eventDesc}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};