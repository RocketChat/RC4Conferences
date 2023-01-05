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
import { EventForm } from "../eventForm";
import { useRouter } from "next/router";
import { editEvent, getTicketDetails, editEventTicket } from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";


export const EditEvent = ({ event, handleToast }) => {
  const [formState, setFormState] = useState({
    name: event.data.attributes.name,
    description: event.data.attributes.description,
    "starts-at": event.data.attributes["starts-at"].slice(0, 16),
    "ends-at": event.data.attributes["ends-at"].slice(0, 16),
    "original-image-url": event.data.attributes["original-image-url"],
    "logo-url" : event.data.attributes["logo-url"],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    online: true,
    "is-sessions-speakers-enabled": true
  });

  const [publish, setPublish] = useState("published");
  const [isPublic, setIsPublic] = useState(false)

  const [ticket, setTicket] = useState({
    name: "Registration",
    state: true,
    quantity: 1,
  });

  const router = useRouter();

  useEffect(() => {
    const ticketInfo = async () => {
      try {
        let token = Cookies.get("event_auth");
        token
          ? (token = JSON.parse(token).access_token)
          : new Error("Please, Sign in again");

        const res = await getTicketDetails(event.data.relationships.tickets.data[0].id, token)

        setTicket({
          name: res.data.attributes.name,
          state: res.data.attributes.type === 'free',
          quantity: res.data.attributes.quantity
        })
      } catch (e) {
        console.error("An error occurred while fetching tickets", e);
      }
    };
    ticketInfo();
  }, [])

  const handleTicketUpdate = async (eid, auth) => {
    const tdata = {
      "data": {
        "attributes": {
          "name": ticket.name,
          "sales-starts-at": new Date(formState["starts-at"]).toISOString(),
          "sales-ends-at": new Date(formState["ends-at"]).toISOString(),
          "quantity": ticket.quantity,
          "type": ticket.state ? "free" : "freeRegistration",
          "min-order": 1,
          "max-order": 1,
          "is-description-visible": true
        },
        "type": "ticket",
        "id": eid
      }
    }

    const tickRes = await editEventTicket(eid, tdata, auth)
    return tickRes;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(formState['logo-url'] === ""){
      delete formState['logo-url'];
    }

    const data = {
      data: {
        attributes: { ...formState, state: publish, privacy: isPublic ? "public" : "private"  },
        id: event.data.id,
        type: "event",
      },
    };

    try {
      let token = Cookies.get("event_auth");
      token
        ? (token = JSON.parse(token).access_token)
        : new Error("Please, Sign in again");

      const res = await editEvent(data, token, event.data.attributes.identifier);

      const tres = handleTicketUpdate(event.data.relationships.tickets.data[0].id, token)

      sessionStorage.setItem("event", JSON.stringify(res.data))
      handleToast({ show: true, msg: "Event Updated Successfully" })
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

  const handleSwitch = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    CustomToast({ type: "success" })
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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublicSwitch = (e) => {
    const checked = e.target.checked
    setIsPublic(checked)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <EventForm intialValues={formState} handleChange={handleChange} ticket={ticket} handleSwitch={handleSwitch} handlePublicSwitch={handlePublicSwitch} />
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

export const CustomToast = ({ show, type, msg }) => {
  return (
    <Toast show={show} className={styles.toast} bg={type}>
      <Toast.Header>
        <strong className="me-auto">Event Alert!</strong>
      </Toast.Header>
      <Toast.Body>{msg}</Toast.Body>
    </Toast>
  )
}
