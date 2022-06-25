import { Card, Nav, Tab, Tabs } from "react-bootstrap";
import { CustomToast, EventBasicCreate } from "./EventBasicDetails";
import styles from "../../../styles/event.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const EventCreate = ({ active }) => {
  const [draft, setDraft] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    msg: ""
  })
  const router = useRouter();


  const pageRoute = {
    "basic-detail": 0,
    sessions: 1,
  };

  useEffect(() => {
    const check = sessionStorage.getItem("draft");

    if (check != "true" && pageRoute[active] !== 0) {
      router.push(Object.keys(pageRoute)[0]);
    }
  }, []);

  const handleToast = (data, publish) => {
    const msgText = `The Event (${data.data.attributes.identifier}) was successfully created & ${publish}`
    setToast((prev) => ({
        ...prev,
        show: true,
        msg: msgText
    }))
  }

  return (
    <>
    <Card className={styles.create_event_root}>
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
        {pageRoute[active] == 0 && <EventBasicCreate handleToast={handleToast} />}
        {pageRoute[active] == 1 && "Coming Soon"}
        {pageRoute[active] == undefined &&
          "Hey! You got yourself on an fabled isle."}
      </Card.Body>
    </Card>
        <CustomToast type={"success"} show={toast.show} msg={toast.msg} />
</>
  );
};
