import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Spinner,
  Stack,
  Tab,
  Tabs,
  Nav
} from "react-bootstrap";
import {
  addEventSpeakers,
  deleteEventSpeaker,
  getEventSpeakers,
} from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";
import { EditEvent, CustomToast } from "./EditEvent";
import toast, { Toaster } from 'react-hot-toast';
import { SponsorForm } from "./SponsorForm";

export const IndivEventDash = ({ eid, event, active }) => {
  const [speakerInfo, setSpeakerInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editSpeaker, setEditSpeaker] = useState({});
  const [load, setLoad] = useState(false);

  let authCookie = Cookies.get("event_auth");
  if (authCookie) {
    authCookie = JSON.parse(authCookie);
  }

  const pageRoute = {
    "basic-detail": 0,
    sponsors: 1,
    sessions: 2,
  };

  const fetchSpeaker = async () => {
    const res = await getEventSpeakers(eid, authCookie?.access_token);
    return res;
  };

  // function to replace empty strings in the editSpeaker object
  const replaceEmpty = (obj) => {
    for (const key in obj) {
      if (obj[key] === "") {
        obj[key] = null;
      }
    }
    return obj;
  }

  const publishSpeaker = async () => {
    const sanitizedSpeaker = replaceEmpty(editSpeaker);

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
          ...sanitizedSpeaker,
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
        toast.success('Speaker added successfully', {
          duration: 20000
        })
        setModalShow(false);
      }
    } catch (e) {
      toast.error("An error occurred while publishing speaker", {
        duration: 20000
      });
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
      toast.success('Speaker deleted successfully', {
        duration: 2000,
      });
      setSpeakerInfo((oarr) => oarr.filter((spk) => spk.id !== e.target.id));
    } catch (e) {
      toast.error("An error occurred while deleting the Speaker", {
        duration: 2000,
      });
    }
  };


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <h4 className="text-center my-2">Editing Event {event.data.attributes.name}</h4>
      <Card className={styles.create_event_root}>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="basic-detail" activeKey={active}>
            <Nav.Item>
              <Nav.Link href="basic-detail">Basic Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="sponsors">Sponsors</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="sessions">Speakers & Session</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="other-details">Contact</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {pageRoute[active] == 0 && <EditEvent event={event} />}
          {pageRoute[active] == 1 && <SponsorForm event={event} />}
          {pageRoute[active] == 2 && (<div className="m-3">
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
          </div>)}
          {pageRoute[active] == undefined &&
            "Hey! You got yourself on an fabled isle."}
        </Card.Body>
      </Card>
      {/* <CustomToast type="success" show={toast.show} msg={toast.msg} /> */}
    </>
  );
};

const SpeakerList = ({
  fetchSpeaker,
  speakerInfo,
  setSpeakerInfo,
  handleDelete,
}) => {
  useEffect(() => {
    const spkInfo = async () => {
      if (!speakerInfo) {
        try {
          const res = await fetchSpeaker();
          setSpeakerInfo(res.data);
        } catch (e) {
          toast.error("An error occurred while loading speakers", {
            duration: 2000
          });
        }
      }
    };
    spkInfo();
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
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Speaker
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
            <InputGroup className="mb-3">
              <InputGroup.Text>Social links</InputGroup.Text>
              <Form.Control
                required
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="Email*"
              />
              <Form.Control
                onChange={handleChange}
                name="linkedin"
                type="url"
                placeholder="LinkedIn"
              />
              <Form.Control
                onChange={handleChange}
                name="github"
                type="url"
                placeholder="GitHub"
              />
            </InputGroup>
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
    </>
  );
};
