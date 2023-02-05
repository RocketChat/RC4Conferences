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
import {
  publishEvent,
  publishEventTicket,
} from "../../../lib/conferences/eventCall";
import { useRouter } from "next/router";
import styles from "../../../styles/event.module.css";
import { EventForm } from "../eventForm";

export const EventBasicCreate = ({ setDraft, handleToast }) => {
  const [isPublic, setIsPublic] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    "starts-at": new Date(),
    "ends-at": new Date(),
    "original-image-url":
      "https://lh3.googleusercontent.com/n6WF5Pv12ucRY8ObS74SY4coMuFs8ALtHmq7brwnMJVkBzNveiTQfj9sBygEt-KT6ykMMzDHZ3ifjY7jQkNx9Lbj7O7zhGTdMLUgkB8=w600",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    online: true,
    "is-sessions-speakers-enabled": true,
    "owner-name": "",
    "owner-description": "",
  });

  const [publish, setPublish] = useState("draft");

  const [ticket, setTicket] = useState({
    name: "",
    state: true,
    quantity: "",
  });

  const router = useRouter();

  useEffect(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const nativeDefaultStart = date.toISOString().slice(0, 16);

    const nativeDefaultEnd = new Date(nativeDefaultStart);
    nativeDefaultEnd.setMinutes(
      nativeDefaultEnd.getMinutes() + 30 - nativeDefaultEnd.getTimezoneOffset()
    );
    nativeDefaultEnd = nativeDefaultEnd.toISOString().slice(0, 16);

    setFormState((prev) => ({
      ...prev,
      "starts-at": nativeDefaultStart,
      "ends-at": nativeDefaultEnd,
    }));
  }, []);

  const handleTicketPublish = async (eid, auth) => {
    const tdata = {
      data: {
        attributes: {
          name: ticket.name,
          "sales-starts-at": new Date(formState["starts-at"]).toISOString(),
          "sales-ends-at": new Date(formState["ends-at"]).toISOString(),
          quantity: ticket.quantity,
          type: ticket.state ? "free" : "freeRegistration",
          "min-order": 1,
          "max-order": 1,
          "is-description-visible": true,
        },
        relationships: {
          event: {
            data: {
              type: "event",
              id: eid,
            },
          },
        },
        type: "ticket",
      },
    };

    const tickRes = await publishEventTicket(tdata, auth);
    return tickRes;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      data: {
        attributes: {
          ...formState,
          state: publish,
          privacy: isPublic ? "public" : "private",
        },
        type: "event",
      },
    };
    try {
      let token = Cookies.get("event_auth");
      token
        ? (token = JSON.parse(token).access_token)
        : new Error("Please, Sign in again");

      const res = await publishEvent(data, token);

      await handleTicketPublish(res.data.data.id, token);

      sessionStorage.setItem("draft", publish == "draft");
      sessionStorage.setItem("event", JSON.stringify(res.data));
      handleToast(res.data, publish);
      router.push("sessions");
    } catch (e) {
      console.error("Event create failed", e.response.data.error);
      if (e.response.status == 401) {
        Cookies.remove("event_auth");
        router.push("/conferences");
      }
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

  const handleSwitch = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    CustomToast({ type: "success" });
    name === "switch"
      ? setTicket((prev) => ({
        ...prev,
        state: !ticket.state,
      }))
      : setTicket((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const handlePublicSwitch = (e) => {
    const checked = e.target.checked;
    setIsPublic(checked);
  };

  return (
    <>
      <Card>
        <Card.Header>Creating Event {formState.name}!</Card.Header>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <EventForm
              intialValues={formState}
              isPublic={isPublic}
              handleChange={handleChange}
              ticket={ticket}
              handleSwitch={handleSwitch}
              handlePublicSwitch={handlePublicSwitch}
            />
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" type="submit">
                Next
              </Button>
              <Button
                variant="success"
                onClick={() => setPublish("published")}
                type="submit"
              >
                Publish
              </Button>
            </ButtonGroup>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export const CustomToast = ({ show, type, msg }) => {
  return (
    <Toast show={show} className={styles.toast} bg={type}>
      <Toast.Header>
        <strong className="me-auto">Event Alert!</strong>
      </Toast.Header>
      <Toast.Body>{msg}</Toast.Body>
    </Toast>
  );
};
