import { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import { GoLocation } from 'react-icons/go';
import styles from '../styles/index.module.css';
import { atcb_action } from 'add-to-calendar-button';
import { BiCalendarPlus } from 'react-icons/bi';

function EventStrip({
  event,
  ticket,
  containerRef,
  customLink,
  handleJoin,
  eid,
  showMainstage,
}) {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [formattedStartDate, setFormattedStartDate] = useState(event.starts_at);
  const [formattedEndDate, setFormattedEndDate] = useState(event.ends_at);
  const [config, setConfig] = useState({});

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimeZone);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimeZone, // ✅ Now it updates only on the client
    };

    setFormattedStartDate(
      new Date(event.starts_at).toLocaleString('en-US', options)
    );
    setFormattedEndDate(
      new Date(event.ends_at).toLocaleString('en-US', options)
    );

    setConfig({
      name: event?.name,
      description: event?.description,
      startDate: '2025-03-27',
      timeZone: 'Asia/Calcutta',
      startTime: '16:30',
      endTime: '23:30',
      organizer: event?.organizer,
      location: customLink,
      options: [
        'Apple',
        'Google',
        'iCal',
        'Microsoft365',
        'MicrosoftTeams',
        'Outlook.com',
        'Yahoo',
      ],
      iCalFileName: 'rocket-chat-gsoc-alumni-summit-2025',
    });
  }, [event.starts_at, event.ends_at]);

  return (
    <Container
      className={styles.event_strip_container}
      ref={containerRef}
      fluid
    >
      <Row className={styles.event_strip_name}>
        <Col style={{ overflow: 'auto' }}>{event.name}</Col>
        <Col
          xs={2}
          md={1.5}
          xl={0.5}
          sm={2}
          xxl={1.5}
          className="event-join-button"
        >
          {showMainstage ? (
            <Button size="sm" onClick={handleJoin}>
              Join
            </Button>
          ) : (
            <ButtonGroup>
              <Button size="sm" id="custom" href={customLink} target="_blank">
                Join
              </Button>
              <Button
                variant={'light'}
                size="sm"
                onClick={() => atcb_action(config)}
              >
                <BiCalendarPlus color="#ff6a71" />
              </Button>
            </ButtonGroup>
          )}
        </Col>
      </Row>
      <hr />
      <Row className={styles.event_strip_bottom}>
        <Col sm={4} md={5} className="event-datetime">
          <Row>Time and Date ({timezone})</Row>
          <Row>
            {formattedStartDate} - {formattedEndDate}
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
            <Col>{event['location-name'] || 'Online'}</Col>
          </Row>
        </Col>
        <Col className="event-ticket-details">
          <Row>
            <Col>
              {ticket ? ticket.name : 'Community'}{' '}
              <Badge as={'span'} pill bg="light" text="secondary">
                {ticket?.price ?? 'Free'}
              </Badge>
            </Col>
          </Row>
          <div className="ticket-name"></div>
          <div className="ticket-price">{ticket ? ticket.price : 'Free'}</div>
        </Col>
      </Row>
    </Container>
  );
}

export default EventStrip;
