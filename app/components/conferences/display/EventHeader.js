import { useMediaQueries, useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { Col, Container, Image, Row, Stack } from "react-bootstrap";
import styles from "../../../styles/event.module.css";
import { EventTicket } from "./EventRegisterSection";
import { BsCalendar2Event, BsInfoCircle } from "react-icons/bs";
import { GoLocation } from "react-icons/go";

export const SmEventHeader = ({ event }) => {
  const isSmallScreen = useMediaQuery("(max-width: 576px)");

  return (
    <div className={styles.event_banner}>
      <Image src={event.data.attributes["original-image-url"]} fluid />
      <EventTicket tktDetail={event.included[0]} />

      <div className={styles.event_banner_title}>
        <Container>
          <Row>
            <Col>
              <h4>{event.data.attributes.name}</h4>
              <p>
                by{" "}
                <span style={{ color: "#d6162f" }}>
                  {event.data.attributes["owner-name"]}
                </span>
              </p>
            </Col>
          </Row>
        </Container>
        <hr />
        <Stack
          gap={isSmallScreen ? 3 : 1}
          direction={isSmallScreen ? "vertical" : "horizontal"}
        >
          <EventDate eventData={event.data} />
          <EventLocation eventData={event.data} />
        </Stack>
      </div>
    </div>
  );
};

export const MdEventHeader = ({ event }) => {
  const isSmallScreen = useMediaQuery("(max-width: 576px)");

  const isCalScreen = useMediaQueries(
    "(min-width: 450px)",
    " (max-width: 500px)"
  );
  return (
    <div className={styles.event_banner}>
      <Container>
        <Row>
          <Col fluid>
            <Image src={event.data.attributes["original-image-url"]} fluid />
          </Col>
          <Col className="mt-1" fluid>
            <Row>
              <h4>{event.data.attributes.name}</h4>
              <p>
                by{" "}
                <span style={{ color: "#d6162f" }}>
                  {event.data.attributes["owner-name"]}
                </span>
              </p>
            </Row>

            <Stack gap={3}>
              <EventDate eventData={event.data} />
              <MdEventLocation eventData={event.data} />
            </Stack>
          </Col>
        </Row>
      </Container>

      <EventTicket tktDetail={event.included[0]} />
    </div>
  );
};

export const EventDate = ({ eventData }) => {
  let start = eventData.attributes["starts-at"];
  let end = eventData.attributes["ends-at"];
  start = `${new Date(start).toDateString()} ${new Date(
    start
  ).toLocaleTimeString()}`;
  end = `${new Date(end).toDateString()} ${new Date(end).toLocaleTimeString()}`;

  return (
    <Container>
      <Row className={styles.date_icon}>
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

export const EventSingleDate = ({ eventData }) => {
  let start = eventData.attributes["starts-at"];
  start = new Date(start);
  const month = start.toLocaleString("default", { month: "short" });
  const date = start.getDate();
  return (
    <Stack className="mx-auto">
      <span>{month}</span>
      <span>{date}</span>
    </Stack>
  );
};

const EventLocation = ({ eventData }) => {
  const location = eventData.attributes["location-name"];

  return (
    <Container>
      <Row>
        <Col xs={1}>
          <GoLocation />
        </Col>
        <Col>
          <div className={styles.event_date}>
            <h6>Location</h6>
            {location ? location : "Online"}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const MdEventLocation = ({ eventData }) => {
  const location = eventData.attributes["location-name"];

  return (
    <Container className="mb-5">
      <Row>
        <Col xs={1}>
          <GoLocation />
        </Col>
        <Col>
          <div className={styles.event_date}>
            {location ? <h6>location</h6> : "Online"}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
