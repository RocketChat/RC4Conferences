import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Container,
  Modal,
  Nav,
  Navbar,
} from "react-bootstrap";
import styles from "../../../styles/event.module.css";
import { BiError } from "react-icons/bi";
import { useRouter } from "next/router";

const detectElement = (options) => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  const callbackFn = (entries) => {
    const [entry] = entries;
    setInView(entry.isIntersecting);
  };

  useEffect(() => {
    let observer = new IntersectionObserver(callbackFn, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, inView];
};

export const EventTicket = ({ tktDetail, event, isSignedIn }) => {
  const [containerRef, inView] = detectElement({
    root: null,
    rootMargin: "0px 0px 100% 0px",
    threshold: 0.7,
  });

  const [open, setOpen] = useState(false);

  const tktName = tktDetail.attributes.name;
  const tktPrice = tktDetail.attributes.price;
  const handleJoin = () => {
    setOpen(!open);
  };

  return (
    <>
      <InNav
        brand={tktName}
        price={tktPrice}
        handleJoin={handleJoin}
        containerRef={containerRef}
      />
      {!inView && (
        <TopNav brand={tktName} price={tktPrice} handleJoin={handleJoin} />
      )}
      <JoinModal
        open={open}
        handleClose={handleJoin}
        event={event}
        isSignedIn={isSignedIn}
      />
    </>
  );
};

const InNav = ({ brand, price, handleJoin, containerRef }) => {
  return (
    <Navbar
      ref={containerRef}
      className={styles.event_ticket_nav}
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          {brand}{" "}
          <Badge as={"span"} pill bg="light" text="secondary">
            {price ? price : "Free"}
          </Badge>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        <Button onClick={handleJoin}>Join</Button>
      </Container>
    </Navbar>
  );
};

const TopNav = ({ brand, price, handleJoin }) => {
  return (
    <Navbar fixed={"top"} className={styles.event_ticket_nav} variant="dark">
      <Container>
        <Navbar.Brand>
          {brand}{" "}
          <Badge as={"span"} pill bg="light" text="secondary">
            {price ? price : "Free"}
          </Badge>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        <Button onClick={handleJoin}>Join</Button>
      </Container>
    </Navbar>
  );
};

const JoinModal = ({ open, handleClose, event, isSignedIn }) => {
  const eventName = event?.data?.attributes.name;
  const eventId = event?.data?.id;
  const router = useRouter();

  const handleRedirect = (e) => {
    const targetLocation = e.target.name;
    try {
      router.push(`/conferences/${targetLocation}/${eventId}`);
    } catch (e) {
      console.error("An error while redirecting to the Day Of Event Page");
    }
  };
  return (
    <Modal show={open} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Join, {eventName ? eventName : "Event"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.join_modal_button}>
          <Button
            name={"greenroom"}
            disabled={!isSignedIn}
            onClick={handleRedirect}
          >
            Join as a Speaker
          </Button>
          <br />
          <Button
            disabled={!isSignedIn}
            name={"mainstage"}
            onClick={handleRedirect}
          >
            Join as a Attendee
          </Button>
        </div>
        <Alert className="mt-3" variant={"danger"} show={!isSignedIn}>
          {<BiError />} Looks like you are not logged in, please login to
          continue!
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
