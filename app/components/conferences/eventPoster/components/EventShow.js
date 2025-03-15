import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Container,
  Image,
  Row,
  Stack,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap';
import styles from '../styles/index.module.css';

import { MdEventSpeaker, SmEventSpeaker } from './EventSpeaker';
import { MdEventHeader, SmEventHeader } from './EventHeader';

import { BsYoutube } from 'react-icons/bs';
import useMediaQuery from '../../useMediaQuery';

const EventShow = ({ event, error, speaker, prsession, customLink }) => {
  let urlHash = '';

  const [key, setKey] = useState('home');
  const [toOpen, setToOpen] = useState({});

  const helperTabOptions = ['home', 'sessions', 'speakers'];
  useEffect(() => {
    const rawHash = window.location.hash;
    urlHash = rawHash.substring(1);
    if (helperTabOptions.includes(urlHash)) setKey(urlHash);
  }, []);

  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  return (
    <>
      <MdEventHeader event={event} error={error} customLink={customLink} />
      <SmEventHeader event={event} error={error} customLink={customLink} />
      <Card className={styles.event_show_root}>
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
                  <Image src={event.data['logo_url']} width={100} />
                </div>
                <div className={styles.event_organizer_header}>
                  <h6> Organizer </h6>
                </div>
              </Stack>
            </Tab>
            {prsession && (
              <Tab eventKey="sessions" title="Sessions">
                <EventSession
                  session={prsession}
                  toOpen={toOpen}
                  setToOpen={setToOpen}
                />
              </Tab>
            )}
            <Tab eventKey="speakers" title="Speakers">
              {key == 'speakers' &&
                (isSmallScreen ? (
                  <SmEventSpeaker
                    eid={event.data.identifier}
                    speaker={speaker}
                  />
                ) : (
                  <MdEventSpeaker
                    eid={event.data.identifier}
                    speaker={speaker}
                  />
                ))}
            </Tab>
          </Tabs>
        </div>
      </Card>
    </>
  );
};

const EventDesc = ({ eventData }) => {
  const eventDesc = eventData.description;
  // eventDesc = eventDesc.replace(/(<([^>]+)>)/gi, "");

  return (
    <Container className={styles.event_desc}>
      <Row>
        <Col>
          <div>
            <h6>About the Event</h6>
            <div dangerouslySetInnerHTML={{ __html: eventDesc }} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const EventSession = ({ session, toOpen, setToOpen }) => {
  const helperHead = {
    start_time: 'Time',
    presenter: 'Presenter',
    mentor: 'Mentor',
    presentation_title: 'Presentation Title',
    duration_minutes: 'Duration Minutes',
  };

  const excludedFields = [
    'createdAt',
    'updatedAt',
    'Description',
    'Event',
    'Mentor',
  ];

  let headerItems = [];

  if (Array.isArray(session.session_items.data)) {
    headerItems = Object.keys(session.session_items.data[0]).filter(
      (it) => !excludedFields.includes(it)
    );
  }

  const retHours = (tm) => {
    const tmToDate = new Date(tm);
    return tmToDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSessionExpand = (e) => {
    const tmod = e.target.id;
    setToOpen((prev) => ({
      ...prev,
      [tmod]: !toOpen[tmod],
    }));
  };

  return (
    <Container style={{ maxWidth: '99vw' }}>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>#</th>
            {headerItems.length > 0
              ? headerItems.map((hitem, ind) => {
                  return <th key={ind}>{hitem}</th>;
                })
              : 'No Sessions Header'}
          </tr>
        </thead>
        {Array.isArray(session.session_items.data) ? (
          session.session_items.data.map((sess) => {
            return (
              <tbody key={sess.id}>
                <tr>
                  <td>
                    <Badge
                      size="sm"
                      id={sess.id}
                      onClick={handleSessionExpand}
                      bg="light"
                      text="dark"
                      className={styles.session_expand}
                    >
                      {'>'}
                    </Badge>
                  </td>
                  <td>{retHours(sess.Start)}</td>
                  <td>{retHours(sess.End)}</td>
                  <td>{sess.Speaker}</td>
                  <td>{sess.Title}</td>
                  <td>{sess.Duration}</td>
                  <td>
                    <Button
                      variant="link"
                      target="_blank"
                      href={`${sess.Youtube}`}
                      disabled={!sess.Youtube}
                    >
                      <BsYoutube
                        color="red"
                        size={'25'}
                        href={`${sess.Youtube}`}
                      />
                      Coming...
                    </Button>
                  </td>
                </tr>
                <tr>
                  <Collapse in={toOpen[sess.id]}>
                    <td colSpan="12">{`Descsription: ${sess.Description}`}</td>
                  </Collapse>
                </tr>
              </tbody>
            );
          })
        ) : (
          <tbody>
            <tr></tr>
          </tbody>
        )}
      </Table>
    </Container>
  );
};

export default EventShow;
