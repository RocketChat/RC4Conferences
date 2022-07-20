import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Spinner,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  addEventSpeakers,
  deleteEventSpeaker,
  getEventSpeakers,
} from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";

export const IndivEventDash = ({ eid, event }) => {
  const [speakerInfo, setSpeakerInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editSpeaker, setEditSpeaker] = useState({});
  const [load, setLoad] = useState(false);
  console.log("event", event);

  let authCookie = Cookies.get("event_auth");
  if (authCookie) {
    authCookie = JSON.parse(authCookie);
  }

  const fetchSpeaker = async () => {
    const res = await getEventSpeakers(eid, authCookie?.access_token);
    return res;
  };

  const publishSpeaker = async () => {
    const toPublish = {
      data: {
        type: "speaker",
        relationships: {
          event: {
            data: {
              type: "event",
              id: eid,
            },
          },
          user: {
            data: {
              type: "user",
              id: authCookie?.jwtInfo?.identity,
            },
          },
        },
        attributes: {
          ...editSpeaker,
        },
      },
    };

    const res = await addEventSpeakers(toPublish, authCookie?.access_token);
    return res;
  };

  const handleAddSpeaker = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      if (form.checkValidity() === true) {
        setLoad(true);
        const res = await publishSpeaker();
        setSpeakerInfo((oarr) => [...oarr, res.data.data]);
        setModalShow(false);
      }
    } catch (e) {
      console.error("An error occurred while publishing speaker", e);
    } finally {
      setLoad(false);
    }
  };

  const handleChange = (e) => {
    const tname = e.target.name;
    const tvalue = e.target.value;
    setEditSpeaker({ ...editSpeaker, [tname]: tvalue });
  };

  const handleDelete = async (e) => {
    try {
      await deleteEventSpeaker(e.target.id, authCookie?.access_token);
      setSpeakerInfo((oarr) => oarr.filter((spk) => spk.id !== e.target.id));
    } catch (e) {
      console.error("An error occurred while deleting the Speaker", e);
    }
  };
  return (
    <Container>
      <Row>
        <h4>{event.data.attributes.name}</h4>
      </Row>
      <Row>
        <Tabs
          defaultActiveKey="speaker"
          id="uncontrolled-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="speaker" title="Speaker">
            <Stack className={styles.speaker_add_btn}>
              <Button onClick={() => setModalShow(true)}>Add Speaker</Button>
            </Stack>
            <SpeakerModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              handleAddSpeaker={handleAddSpeaker}
              handleChange={handleChange}
              load={load}
            />
            <SpeakerList
              setSpeakerInfo={setSpeakerInfo}
              speakerInfo={speakerInfo}
              fetchSpeaker={fetchSpeaker}
              handleDelete={handleDelete}
            />
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled></Tab>
        </Tabs>
      </Row>
    </Container>
  );
};

const SpeakerList = ({
  fetchSpeaker,
  speakerInfo,
  setSpeakerInfo,
  handleDelete,
}) => {
  useEffect(async () => {
    if (!speakerInfo) {
      try {
        const res = await fetchSpeaker();
        setSpeakerInfo(res.data.data);
      } catch (e) {
        console.error("An error occurred while loading speakers", e);
      }
    }
  }, []);
  return (
    <ListGroup>
      {Array.isArray(speakerInfo) && speakerInfo.length
        ? speakerInfo.map((spk) => {
            return (
              <ListGroupItem key={spk.id}>
                <Container>
                  <Row className="align-items-baseline">
                    <Col xs sm md={1}>
                      <Image
                        width={"50em"}
                        height={"50em"}
                        roundedCircle
                        src={spk.attributes["photo-url"]}
                      />
                    </Col>
                    <Col>
                      <span>{spk.attributes.name}</span>
                    </Col>
                    <Col className={styles.event_speaker_delete}>
                      <Button
                        variant={"danger"}
                        id={spk.id}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </ListGroupItem>
            );
          })
        : "No Speaker found"}
    </ListGroup>
  );
};

const SpeakerModal = (props) => {
  const { handleAddSpeaker, handleChange } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleAddSpeaker}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Profile Pic URL</Form.Label>
            <Form.Control
              type="url"
              onChange={handleChange}
              name="photo-url"
              placeholder="https://link-to.image"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="name@example.com"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Short Biography</Form.Label>
            <Form.Control
              required
              onChange={handleChange}
              name="short-biography"
              as="textarea"
              type="textarea"
              placeholder="A short sweet biography"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Long Biography</Form.Label>
            <Form.Control
              as="textarea"
              onChange={handleChange}
              name="long-biography"
              type="textarea"
              placeholder="Write to your heart's content"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={props.load} variant="success" type="submit">
            {props.load ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Add"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
