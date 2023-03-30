import { useState, useEffect } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { GoLocation } from 'react-icons/go';
import styles from '../styles/index.module.css';

function EventStrip({
  event,
  ticket,
  containerRef,
  customLink,
  handleJoin,
  eid,
  showMainstage,
}) {
  const [timezone, setTimezone] = useState('');
  const [startDate, setStartDate] = useState(event.attributes['starts-at']);
  const [endDate, setEndDate] = useState(event.attributes['ends-at']);

  useEffect(() => {
    // Fetch the timezone from the user's browser
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(timeZone);
    const start = new Date(event.attributes['starts-at']);
    const end = new Date(event.attributes['ends-at']);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone, // specify the timezone here
    };

    setStartDate(`${new Date(start).toLocaleTimeString('en-US', options)}`);
    setEndDate(`${new Date(end).toLocaleTimeString('en-US', options)}`);
  }, [event.attributes['starts-at'], event.attributes['ends-at'], timezone]);

  return (
    <Container
      className={styles.event_strip_container}
      ref={containerRef}
      fluid
    >
      <Row className={styles.event_strip_name}>
        <Col style={{ overflow: 'auto' }}>{event.attributes.name}</Col>
        <Col
          xs={2}
          md={1}
          xl={1}
          sm={1.5}
          xxl={1}
          className="event-join-button"
        >
          {showMainstage ? (
            <Button size="sm" onClick={handleJoin}>
              Join
            </Button>
          ) : (
            <Button
              size="sm"
              href={customLink || `/conferences/greenroom/${eid}`}
              target="_blank"
            >
              Join (BBB)
            </Button>
          )}
        </Col>
      </Row>
      <hr />
      <Row className={styles.event_strip_bottom}>
        <Col sm={4} md={5} className="event-datetime">
          <Row>Time and Date ({timezone})</Row>
          <Row>
            {startDate} - {endDate}
          </Row>
        </Col>
        <Col className="event-location">
          <Row className={styles.event_strip_location_row}>
            <Col xs={1} md={1} xl={1} sm={1} xxl={1}>
              <GoLocation />
            </Col>
            <Col>Location</Col>
          </Row>
          <Row>
            <Col xs={1} md={1} xl={1} sm={1} xxl={1}></Col>
            <Col>{event.attributes['location-name'] || 'Online'}</Col>
          </Row>
        </Col>
        <Col className="event-ticket-details">
          <Row>
            <Col>
              {ticket ? ticket.attributes.name : 'Community'}{' '}
              <Badge as={'span'} pill bg="light" text="secondary">
                {ticket?.attributes?.price ?? 'Free'}
              </Badge>
            </Col>
          </Row>
          <div className="ticket-name"></div>
          <div className="ticket-price">
            {ticket ? ticket.attributes.price : 'Free'}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EventStrip;
