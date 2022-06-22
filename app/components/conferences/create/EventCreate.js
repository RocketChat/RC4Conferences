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
    sessions: 1,
  };

  useEffect(() => {
    const check = sessionStorage.getItem("draft");

    if (check != true && pageRoute[active] !== 0) {
      let baseRoute = router.pathname.split("/");
      baseRoute.splice(-1, 1, Object.keys(pageRoute)[0]);
      router.push(baseRoute.join("/"));
    }
  }, []);

  return (
    <Card>
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="basic-detail" activeKey={active}>
          <Nav.Item>
            <Nav.Link href="basic-detail">Basic Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="sessions">Speakers & Session</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="other-details">Other Details</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {pageRoute[active] == 0 && <EventBasicCreate />}
        {pageRoute[active] == 1 && "Coming Soon"}
        {pageRoute[active] == undefined &&
          "Hey! You got yourself on a unknown isle."}
      </Card.Body>
    </Card>
  );
};
