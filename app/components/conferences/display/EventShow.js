import { useEffect, useState } from "react";
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
} from "react-bootstrap";
import styles from "../../../styles/event.module.css";

import { MdEventSpeaker, SmEventSpeaker } from "./EventSpeaker";
import { useMediaQuery } from "@rocket.chat/fuselage-hooks";
import { MdEventHeader, SmEventHeader } from "./EventHeader";
import Cookies from "js-cookie";
import { unsignCook } from "../../../lib/conferences/eventCall";
import { BiChevronDown, BiExpand } from "react-icons/bi";

export const EventShow = ({ event, error, speaker, prsession }) => {
  const [key, setKey] = useState("home");
  const [toOpen, setToOpen] = useState({});

  const isSmallScreen = useMediaQuery("(max-width: 576px)");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const isMdScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const checkSignedIn = async () => {
      try {
        const hashmail = Cookies.get("hashmail");

        const res = await unsignCook({ hash: hashmail });
        const mail = res.data.mail;

        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (emailRegex.test(mail)) {
          setIsSignedIn(true);
        }
      } catch (e) {
        console.error("An error while verifying admin access", e);
      }
    };
    checkSignedIn();
  }, []);

  return (
    <Card className={styles.event_show_root}>
      {isMdScreen ? (
        <MdEventHeader event={event} isSignedIn={isSignedIn} error={error} />
      ) : (
        <SmEventHeader event={event} isSignedIn={isSignedIn} error={error} />
      )}
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
                <Image src={event.data.attributes["logo-url"]} width={100} />
              </div>
            </Stack>
          </Tab>
          <Tab eventKey="sessions" title="Sessions">
            <EventSession
              session={prsession}
              toOpen={toOpen}
              setToOpen={setToOpen}
            />
          </Tab>
          <Tab eventKey="speakers" title="Speakers">
            {key == "speakers" &&
              (isSmallScreen ? (
                <SmEventSpeaker
                  eid={event.data.attributes.identifier}
                  speaker={speaker}
                />
              ) : (
                <MdEventSpeaker
                  eid={event.data.attributes.identifier}
                  speaker={speaker}
                />
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

const EventSession = ({ session, toOpen, setToOpen }) => {
  const helperHead = {
    start_time: "Time",
    presenter: "Presenter",
    mentor: "Mentor",
    presentation_title: "Presentation Title",
    duration_minutes: "Duration Minutes",
  };


  const retHours = (tm) => {
    const tmToDate = new Date(tm);
    return tmToDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
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
    <Container style={{maxWidth: "99vw"}}>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            {Object.values(helperHead).map((hitem, ind) => {
              return <th key={ind}>{hitem}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(session) ? (
            session.map((sess) => {
              return (
                <>
                  <tr key={sess.id}>
                    <td>
                      <Badge
                        size="sm"
                        id={sess.id}
                        onClick={handleSessionExpand}
                        bg="light" text="dark"
                        className={styles.session_expand}
                      >
                        {">"}
                      </Badge>
                    </td>
                    <td>
                      <Badge pill bg="warning">
                        {" "}
                      </Badge>
                    </td>
                    <td>
                      {retHours(sess.attributes.start_time)} -{" "}
                      {retHours(sess.attributes.end_time)}
                    </td>
                    <td>{sess.attributes.presenter}</td>
                    <td>{sess.attributes.mentor}</td>
                    <td>{sess.attributes.presentation_title}</td>
                    <td>{sess.attributes.duration_minutes}</td>
                  </tr>
                  <tr>
                    <Collapse in={toOpen[sess.id]}>
                      <td colspan="12">{`Descsription: ${sess.attributes.description}`}</td>
                    </Collapse>
                  </tr>
                </>
              );
            })
          ) : (
            <tr></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};
