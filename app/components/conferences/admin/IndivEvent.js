import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  Nav,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  addEventSpeakers,
  getEventSpeakers,
} from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";

export const IndivEventDash = ({ eid }) => {
  const [speakerInfo, setSpeakerInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editSpeaker, setEditSpeaker] = useState({});
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
        const res = await publishSpeaker();
        setSpeakerInfo((oarr) => [...oarr, res.data.data]);
        setModalShow(false);
      }
    } catch (e) {
      console.error("An error occurred while adding publishing speaker", e);
    }
  };

  const handleChange = (e) => {
    const tname = e.target.name;
    const tvalue = e.target.value;
    setEditSpeaker({ ...editSpeaker, [tname]: tvalue });
  };
  return (
    <Container>
      <Tabs
        defaultActiveKey="speaker"
        id="uncontrolled-tab-example"
        className="mb-3"
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
          />
          <SpeakerList
            setSpeakerInfo={setSpeakerInfo}
            speakerInfo={speakerInfo}
            fetchSpeaker={fetchSpeaker}
          />
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled></Tab>
      </Tabs>
    </Container>
  );
};

const SpeakerList = ({
  eid,
  auth,
  fetchSpeaker,
  speakerInfo,
  setSpeakerInfo,
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
                      <Button variant={"danger"} id={spk.id}>
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
      <Form onSubmit={props.handleAddSpeaker}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              onChange={props.handleChange}
              type="text"
              name="name"
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Profile Pic URL</Form.Label>
            <Form.Control
              type="url"
              onChange={props.handleChange}
              name="photo-url"
              placeholder="https://link-to.image"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              onChange={props.handleChange}
              name="email"
              type="email"
              placeholder="name@example.com"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Short Biography</Form.Label>
            <Form.Control
              required
              onChange={props.handleChange}
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
              onChange={props.handleChange}
              name="long-biography"
              type="textarea"
              placeholder="Write to your heart's content"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
