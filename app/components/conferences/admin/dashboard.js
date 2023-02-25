import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, ListGroup } from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import {
  deleteEvent,
  getUserEventDeatils,
} from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";
import toast, { Toaster } from 'react-hot-toast';

export const EventDashBoard = () => {
  const [eventData, setEventData] = useState(null);
  let authCookie = Cookies.get("event_auth");
  if (authCookie) {
    authCookie = JSON.parse(authCookie);
  }
  useEffect(() => {
    const fetchEventDeatils = async () => {
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
  }
  fetchEventDeatils()
  }, []);

  const handleDelete = async (e) => {
    try {
      await deleteEvent(e.target.id, authCookie?.access_token);
      const eventres = await getUserEventDeatils(
        authCookie.jwtInfo.identity,
        authCookie.access_token
      );
      toast.success('Event deleted successfully',{
        duration:2000
      })
      setEventData(eventres.data);
      

    } catch (e) {
      toast.error("An error occurred while deleting the Event",{
        duration:2000
      });
    }
  };

  return (
    <> 
    <ListGroup className={styles.admin_event_list}>
      {eventData?.data &&
        eventData.data.map((event) => {
          return (
            <ListGroup.Item key={event.id} className={styles.admin_event_item}>
              <div>{event.attributes.name}</div>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  target="_blank"
                  href={`/conferences/c/${event.id}`}
                >
                  Preview
                </Button>
                <Button href={`/conferences/admin/c/${event.id}`}>{<BiEdit />}</Button>
                <Button variant={"danger"} id={event.id} onClick={handleDelete}>
                  {<MdDelete id={event.id} onClick={(e) => handleDelete(e)} />}
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
    </>
  );
};
