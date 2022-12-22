import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Toast,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { editEvent } from "../../../lib/conferences/eventCall";
import { useRouter } from "next/router";
import styles from "../../../styles/event.module.css";


export const EditEvent = ({ event, handleToast }) => {
  const [formState, setFormState] = useState({
    name: event.data.attributes.name,
    description: event.data.attributes.description,
    "starts-at": event.data.attributes["starts-at"].slice(0,16),
    "ends-at": event.data.attributes["ends-at"].slice(0,16),
    "original-image-url": "https://lh3.googleusercontent.com/n6WF5Pv12ucRY8ObS74SY4coMuFs8ALtHmq7brwnMJVkBzNveiTQfj9sBygEt-KT6ykMMzDHZ3ifjY7jQkNx9Lbj7O7zhGTdMLUgkB8=w600",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    online: true,
    "is-sessions-speakers-enabled": true 
  });

  const [publish, setPublish] = useState("published");

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      data: {
        attributes: { ...formState, state: publish },
        id : event.data.id,
        type: "event",
      },
    };

    try {
      let token = Cookies.get("event_auth");
      token
        ? (token = JSON.parse(token).access_token)
        : new Error("Please, Sign in again");

      const res = await editEvent(data, token,event.data.attributes.identifier);

      sessionStorage.setItem("event", JSON.stringify(res.data))
      handleToast({show : true,msg : "Event Updated Successfully"})
      router.push("/conferences/admin/dashboard")
    } catch (e) {
      console.error("Event Update failed", e.response.data.error);
      if (e.response.status == 401) {
        Cookies.remove("event_auth");
        router.push("/conferences");
      }
      throw new Error(e);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    <Card>
      <Card.Header>Editing Event {formState.name}!</Card.Header>
      <Card.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event name*</Form.Label>
            <Form.Control
              required
              value={formState.name}
              name="name"
              type="text"
              placeholder=""
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              type="text"
              placeholder=""
              onChange={handleChange}
              value={formState.description}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Banner Image URI</Form.Label>
            <Form.Control
              name="original-image-url"
              type="url"
              placeholder="https://via.placeholder.com/1920x960.png"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Organizer logo</Form.Label>
            <Form.Control
              name="logo-url"
              type="url"
              placeholder="https://via.placeholder.com/100.png"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date*</Form.Label>
            <Form.Control
              required
              name="starts-at"
              type="datetime-local"
              value={formState["starts-at"]}
              min={formState["start-at"]}
              onChange={handleChange}
              placeholder=""
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date*</Form.Label>
            <Form.Control
              required
              name="ends-at"
              type="datetime-local"
              value={formState["ends-at"]}
              min={formState["start-at"]}
              onChange={handleChange}
              placeholder=""
            />
          </Form.Group>
          <ButtonGroup aria-label="Basic example">
            <Button variant="primary" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Form>
      </Card.Body>
    </Card>
    </>

  );
};

export const CustomToast = ({show, type, msg}) => {
    return (
        <Toast show={show} className={styles.toast} bg={type}>
      <Toast.Header>
        <strong className="me-auto">Event Alert!</strong>
      </Toast.Header>
      <Toast.Body>{msg}</Toast.Body>
    </Toast>
    )
}
