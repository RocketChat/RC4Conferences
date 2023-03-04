import { useState, useEffect } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { GoLocation } from 'react-icons/go';

function EventStrip({ event, ticket, containerRef }) {
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
  }, []);

  console.log(ticket.attributes);
  useEffect(() => {
    // Format the start and end date
  }, [event.attributes['starts-at'], event.attributes['ends-at'], timezone]);

  return (
    <Container
      className="event-strip"
      style={{
        background: '#ff6a71',
        maxWidth: '750px',
        borderRadius: '15px',
        color: '#ffffff',
        marginTop: '-50px',
        zIndex: '1',
        position: 'relative',
      }}
      ref={containerRef}
    >
      <Row style={{ display: 'flex', alignItems: 'center', padding: '15px', fontSize: 'small' }}>
        <Col md={4} className="event-name" style={{ fontFamily: 'monospace', fontSize: 'large' }}>
          {event.attributes.name}
        </Col>
        <Col className="event-datetime">
          <Row>Time and Date ({timezone})</Row>
          <Row>
            {startDate} - {endDate}
          </Row>
        </Col>
        <Col className="event-location">
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col xs={1} md={1} xl={1} sm={1} xxl={1}>
              <GoLocation />
            </Col>
            <Col>Location</Col>
          </Row>
          <Row>
          <Col xs={1} md={1} xl={1} sm={1} xxl={1}>
              
            </Col>
            <Col>
            {event.attributes['location-name'] || 'Online'}
            </Col>
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
        <Col xs={1} md={1} xl={1} sm={1} xxl={1} className="event-join-button">
          <Button className="join-button">Join</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EventStrip;
