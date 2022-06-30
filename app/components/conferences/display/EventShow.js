import { useState } from "react";
import {
  Col,
  Container,
  Image,
  Row,
  Tab,
  TabContent,
  Tabs,
} from "react-bootstrap";
import styles from "../../../styles/event.module.css";
import { BsCalendar2Event } from "react-icons/bs";

export const EventShow = ({ event }) => {
  const [key, setKey] = useState("home");
  console.log("even", event);

  let eventDesc = event.data.attributes.description;
  eventDesc = eventDesc.replace(/(<([^>]+)>)/gi, "");

  return (
    <div>
      <div className={styles.event_banner}>
        <Image src={event.data.attributes["original-image-url"]} fluid />
        <div className={styles.event_banner_title}>
          {/* <img src={event.data.attributes["logo-url"]} width={100} /> */}
          <h4>{event.data.attributes.name}</h4>
          <p>by {event.data.attributes["owner-name"]}</p>
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
            <EventDate eventData={event.data} />
            <TabContent as="div" className={styles.event_desc}>
              {eventDesc}
            </TabContent>
          </Tab>
          <Tab eventKey="profile" title="Sessions"></Tab>
          <Tab eventKey="contact" title="Speakers"></Tab>
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
            <h5>
              Date and Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </h5>
            <span>{start + " - "}</span>
            <span>{end}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
