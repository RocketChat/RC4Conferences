import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, ListGroup } from "react-bootstrap";
import { getUserEventDeatils } from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";

export const EventDashBoard = () => {
  const [eventData, setEventData] = useState(null);
  let authCookie = Cookies.get("event_auth");
  if (authCookie) {
    authCookie = JSON.parse(authCookie);
  }
  useEffect(async () => {
    try {
      if (!eventData) {
        const eventres = await getUserEventDeatils(
          authCookie.jwtInfo.identity,
          authCookie.access_token
        );
        setEventData(eventres.data);
      }
    } catch (e) {
      console.error("An error while fetching event details", e);
    }
  }, []);

  return (
    <ListGroup className={styles.admin_event_list}>
      {eventData?.data &&
        eventData.data.map((event) => {
          return (
            <ListGroup.Item key={event.id} className={styles.admin_event_item}>
              <div>{event.attributes.name}</div>
              <ButtonGroup>
                <Button variant="secondary">Preview</Button>
                <Button href={`/conferences/admin/c/${event.id}`}>Edit</Button>
              </ButtonGroup>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
};
