import { Col, Container, Image, Row, Stack } from 'react-bootstrap';
import styles from '../styles/index.module.css';
import { EventTicket } from './EventRegisterSection';
import { BsCalendar2Event, BsInfoCircle } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';
import EventStrip from './EventStrip';
import useMediaQuery from '../../useMediaQuery';

export const SmEventHeader = ({ event, error, customLink }) => {
  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  const sampleTicket = {
    name: 'Free Ticket',
    price: 0,
  };
  console.log('Event Header', event);
  return (
    <div className={styles.event_small_banner}>
      <Image src={event.data['original_image_url']} fluid />
      <EventTicket
        tktDetail={sampleTicket}
        event={event}
        error={error}
        customLink={customLink}
      />
      <div className={styles.event_banner_title}>
        <Container>
          <Row>
            <Col>
              <h4>{event.data.name}</h4>
              <p>
                by{' '}
                <span style={{ color: '#d6162f' }}>
                  {event.data['owner-name'] || 'Dnouv'}
                </span>
              </p>
            </Col>
          </Row>
        </Container>
        <hr />
        <Stack
          gap={isSmallScreen ? 3 : 1}
          direction={isSmallScreen ? 'vertical' : 'horizontal'}
        >
          <EventDate eventData={event.data} />
          <EventLocation eventData={event.data} />
        </Stack>
      </div>
    </div>
  );
};

export const MdEventHeader = ({ event, error, customLink }) => {
  console.log('Event Header', event);
  const sampleTicket = {
    name: 'Community Ticket',
    price: 'Free',
  };
  return (
    <div className={styles.event_big_banner}>
      <div
        style={{
          background: `url(${event.data['original_image_url']})`,
          backgroundRepeat: 'round',
          borderRadius: '15px',
          margin: 'auto',
          maxWidth: '900px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ backdropFilter: 'blur(10px)', borderRadius: 'inherit' }}>
          <Image
            src={event.data['original_image_url']}
            style={{ scale: '70%' }}
            fluid
          />
        </div>
      </div>
      <EventStrip event={event.data} ticket={sampleTicket} />
      {/* <Container className={styles.event_custom_container}>
        <Row
          style={{
            background: `url(${event.data['original_image_url']})`,
            backgroundSize: '67%',
          }}
        >
          <Col fluid="true">
          </Col>
          <Col
            className="mt-1"
            md={5}
            sm={5}
            style={{ backdropFilter: 'blur(45px)' }}
          >
            <Row>
              <h5>{event.data.name}</h5>
              <p>
                by{' '}
                <span style={{ color: '#d6162f' }}>
                  {event.data['owner-name'] || 'Dnouv'}
                </span>
              </p>
            </Row>

            <Stack gap={3}>
              <MdEventDate eventData={event.data} />
              <MdEventLocation eventData={event.data} />
            </Stack>
          </Col>
        </Row>
      </Container> */}
      {/* <EventTicket
        tktDetail={event.included[0]}
        event={event}
        error={error}
        customLink={customLink}
      /> */}
    </div>
  );
};

export const EventDate = ({ eventData }) => {
  let start = eventData['starts_at'];
  let end = eventData['ends_at'];
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
            <span>{start + ' - '}</span>
            <span>{end}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export const MdEventDate = ({ eventData }) => {
  let start = eventData['starts_at'];
  let end = eventData['ends_at'];
  start = `${new Date(start).toDateString()} ${new Date(
    start
  ).toLocaleTimeString()}`;
  end = `${new Date(end).toDateString()} ${new Date(end).toLocaleTimeString()}`;

  return (
    <Row className={styles.date_icon}>
      <Col xs={1}>
        <BsCalendar2Event />
      </Col>
      <Col>
        <div className={styles.event_date}>
          <h6>
            Date and Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
          </h6>
          <span>{start + ' - '}</span>
          <span>{end}</span>
        </div>
      </Col>
    </Row>
  );
};

export const EventSingleDate = ({ eventData }) => {
  let start = eventData['starts_at'];
  start = new Date(start);
  const month = start.toLocaleString('default', { month: 'short' });
  const date = start.getDate();
  return (
    <Stack className="mx-auto">
      <span>{month}</span>
      <span>{date}</span>
    </Stack>
  );
};

const EventLocation = ({ eventData }) => {
  const location = eventData['location-name'];

  return (
    <Container>
      <Row>
        <Col xs={1}>
          <GoLocation />
        </Col>
        <Col>
          <div className={styles.event_date}>
            <h6>Location</h6>
            {location ? location : 'Online'}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const MdEventLocation = ({ eventData }) => {
  const location = eventData['location-name'];

  return (
    <Row className="mb-5">
      <Col xs={1}>
        <GoLocation />
      </Col>
      <Col>
        <div className={styles.event_date}>
          {location ? <h6>location</h6> : 'Online'}
        </div>
      </Col>
    </Row>
  );
};
