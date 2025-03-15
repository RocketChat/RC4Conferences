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
  const [timezone, setTimezone] = useState('');
  const [startDate, setStartDate] = useState(event['starts_at']);
  const [endDate, setEndDate] = useState(event['ends_at']);
  const [config, setConfig] = useState({});

  useEffect(() => {
    // Fetch the timezone from the user's browser
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(timeZone);
    const start = new Date(event['starts_at']);
    const end = new Date(event['ends_at']);

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

    const config = {
      name: event?.['name'],
      description: event?.['description'],
      startDate: '2024-03-25',
      startTime: '11:00',
      endTime: '14:30',
      organizer: 'Rocket.Chat|devanshu.sharma@rocket.chat',
      location: 'https://meet.google.com/dbt-czaj-whr',
      options: [
        'Apple',
        'Google',
        'iCal',
        'Microsoft365',
        'MicrosoftTeams',
        'Outlook.com',
        'Yahoo',
      ],
      iCalFileName: 'rocket-chat-gsoc-alumni-summit-2024',
    };

    setConfig(config);
  }, [event['starts_at'], event['ends_at'], timezone]);

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
            <>
              <Button size="sm" onClick={handleJoin}>
                Join
              </Button>
            </>
          ) : (
            <ButtonGroup>
              <Button
                size="sm"
                href={customLink || `/conferences/greenroom/${eid}`}
                target="_blank"
              >
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
