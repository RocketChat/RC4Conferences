import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Container,
  Modal,
  Nav,
  Navbar,
} from 'react-bootstrap';
import styles from '../styles/index.module.css';
import { BiError } from 'react-icons/bi';
import { useRouter } from 'next/router';
import EventStrip from './EventStrip';

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

export const EventTicket = ({ tktDetail, event, error, customLink }) => {
  const [containerRef, inView] = detectElement({
    root: null,
    rootMargin: '0px 0px 100% 0px',
    threshold: 0.1,
  });

  const [open, setOpen] = useState(false);

  const errMessHelper = {
    0: "The User Email doesn't have the Speaker/Admin rights, please contact the event organizer for rights.",
    1: 'It seems there is an issue with your login, please logout and signin then try again!',
    2: 'Looks like you are not logged in, please login and try again!',
  };
  const [err, setErr] = useState(errMessHelper[2]);
  const [alertOp, setAlertOp] = useState(false);

  useEffect(() => {
    if (Object.keys(errMessHelper).includes(error)) {
      setErr(errMessHelper[error]);
      setAlertOp(true);
    }
  });

  const tktName = tktDetail.attributes.name;
  const tktPrice = tktDetail.attributes.price;
  const handleJoin = () => {
    setOpen(!open);
  };

  const showMainstage = event?.data?.attributes['is-videoroom-enabled'];
  const eid = event?.data?.attributes.identifier;

  return (
    <>
      <EventStrip
        event={event.data}
        ticket={tktDetail}
        containerRef={containerRef}
        handleJoin={handleJoin}
        showMainstage={showMainstage}
        eid={eid}
        customLink={customLink}
      />
      {!inView && (
        <TopNav
          brand={tktName}
          price={tktPrice}
          handleJoin={handleJoin}
          showMainstage={showMainstage}
          eid={eid}
          customLink={customLink}
        />
      )}
      <JoinModal
        open={open}
        handleClose={handleJoin}
        event={event}
        alertOp={alertOp}
        setAlertOp={setAlertOp}
        err={err}
      />
    </>
  );
};

const InNav = ({
  brand,
  price,
  handleJoin,
  containerRef,
  showMainstage,
  eid,
  customLink,
}) => {
  return (
    <Navbar
      ref={containerRef}
      className={styles.event_ticket_innav}
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          {brand}{' '}
          <Badge as={'span'} pill bg="light" text="secondary">
            {price ? price : 'Free'}
          </Badge>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        {showMainstage ? (
          <Button onClick={handleJoin}>Join</Button>
        ) : (
          <Button
            href={customLink || `/conferences/greenroom/${eid}`}
            target="_blank"
          >
            Join
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

const TopNav = ({
  brand,
  price,
  handleJoin,
  showMainstage,
  eid,
  customLink,
}) => {
  return (
    <Navbar fixed={'bottom'} className={styles.event_ticket_nav} variant="dark">
      <Container>
        <Navbar.Brand style={{ fontSize: 'inherit', fontFamily: 'monospace' }}>
          {brand}{' '}
          <Badge as={'span'} pill bg="light" text="secondary">
            {price ? price : 'Free'}
          </Badge>
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        {/* <Link href={"https://bbb.rocket.chat/b/deb-ped-v5x-mp5"}>
        <Button>Join</Button>
        </Link> */}
        {showMainstage ? (
          <Button size="sm" onClick={handleJoin}>
            Join
          </Button>
        ) : (
          <Button
            size="sm"
            href={customLink || `/conferences/greenroom/${eid}`}
            target="_blank"
          >
            Join
          </Button>
        )}{' '}
      </Container>
    </Navbar>
  );
};

const JoinModal = ({ open, handleClose, event, alertOp, setAlertOp, err }) => {
  const eventName = event?.data?.attributes.name;
  const eventId = event?.data?.id;
  const router = useRouter();

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSignedIn = async () => {
      try {
        const isSignedIn = await isSignedIn();

        if (isSignedIn) {
          setIsSignedIn(true);
        }
      } catch (e) {
        console.error('An error while verifying admin access', e);
      }
    };
    try {
      if (event.data.attributes.privacy === 'private') {
        checkSignedIn();
      } else {
        setIsSignedIn(true);
      }
    } catch (e) {
      console.error(
        'An error occurred while whitelisting the event as public',
        e
      );
    }
  });

  const handleRedirect = (location) => {
    if (typeof window != 'undefined') {
      window.open(location, '_blank');
    }
  };

  return (
    <Modal show={open} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Join, {eventName ? eventName : 'Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.join_modal_button}>
          <Button
            name={'greenroom'}
            onClick={() => handleRedirect(`/conferences/greenroom/${eventId}`)}
            disabled={!isSignedIn}
          >
            Join as a Speaker
          </Button>
          <br />
          <Button
            disabled={!isSignedIn}
            onClick={() => handleRedirect(`/conferences/mainstage/${eventId}`)}
            name={'mainstage'}
          >
            Join as a Attendee
          </Button>
        </div>
        <Alert
          className="mt-3"
          variant={'danger'}
          show={!isSignedIn || alertOp}
        >
          {<BiError />} {err}
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
