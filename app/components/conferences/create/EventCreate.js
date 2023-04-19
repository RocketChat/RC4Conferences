import { Card, Nav, Tab, Tabs } from "react-bootstrap";
import { EventBasicCreate } from "./EventBasicDetails";
import styles from "../../../styles/event.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const EventCreate = ({ active }) => {
  const [draft, setDraft] = useState(false);
  const router = useRouter();


  const pageRoute = {
    "basic-detail": 0,
  };

  useEffect(() => {
    const check = sessionStorage.getItem("draft");

    if (check != "true" && pageRoute[active] !== 0) {
      router.push(Object.keys(pageRoute)[0]);
    }
  }, []);

  

  return (
    <>
    <Card className={styles.create_event_root}>
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="basic-detail" activeKey={active}>
          <Nav.Item>
            <Nav.Link href="basic-detail">Basic Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="sponsors" disabled>Sponsors</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="sessions" disabled>Speakers & Session</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="other-details" disabled>Other Details</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {pageRoute[active] == 0 && <EventBasicCreate  />}
        {pageRoute[active] == 1 && "Coming Soon"}
        {pageRoute[active] == undefined &&
          "Hey! You got yourself on an fabled isle."}
      </Card.Body>
    </Card>
</>
  );
};
