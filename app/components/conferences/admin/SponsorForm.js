import { useEffect, useState } from "react";
import {
    Button,
    Container,
    Row,
    Col,
    Form,
    InputGroup,
    Toast,
    Stack,
    ListGroup,
    ListGroupItem,
    Modal,
    ButtonGroup
} from "react-bootstrap";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { deleteSponsor, editEvent, getSponsorsDetails, publishSponsor, updateSponsor } from "../../../lib/conferences/eventCall";
import styles from "../../../styles/event.module.css";
import toast, { Toaster } from 'react-hot-toast';


export const SponsorForm = ({ event }) => {

    const router = useRouter()
    const [sponsors, setSponsors] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [load, setLoad] = useState(false)
    const [sponsorForm, setSponsorForm] = useState({})
    const isSponsorsEnabled = event.data.attributes["is-sponsors-enabled"];

    const modalHandleChange = (e) => {
        const tname = e.target.name;
        const tvalue = e.target.value;
        setSponsorForm({ ...sponsorForm, [tname]: tvalue });
    }

    const handleChange = (e,index) => {
        const tname = e.target.name;
        const tvalue = e.target.value;

        let changedSponsors = sponsors;
        changedSponsors[index].attributes[tname] = tvalue;

        setSponsors(changedSponsors)
    }

    const handleDelete = async (index) => {
        try {
            let token = Cookies.get("event_auth");
                token
                    ? (token = JSON.parse(token).access_token)
                    : new Error("Please, Sign in again");

            await deleteSponsor(sponsors[index].id,token);
            const newSponsorList = sponsors.filter((val,id) => {return id !== index});
            setSponsors(newSponsorList)
        } catch (error) {
            console.log("Error in deleting in the sponsor",error)
        }
    }

    const handleAddSponsor = async (e) => {
        e.preventDefault()
        try {
            const data = {
                data: {
                    relationships: {
                        event: {
                            data: {
                                type: "event",
                                id: event.data.id
                            }
                        }
                    },
                    attributes: sponsorForm,
                    type: "sponsor"
                }
            }

            let token = Cookies.get("event_auth");
            token
                ? (token = JSON.parse(token).access_token)
                : new Error("Please, Sign in again");

            if (!isSponsorsEnabled) {

                const eventData = {
                    data: {
                        attributes: {
                            name: event.data.attributes.name,
                            description: event.data.attributes.description,
                            "starts-at": event.data.attributes["starts-at"],
                            "ends-at": event.data.attributes["ends-at"],
                            "original-image-url": event.data.attributes["original-image-url"],
                            "logo-url": event.data.attributes["logo-url"],
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            "is-sponsors-enabled": true
                        },
                        id: event.data.id,
                        type: "event"
                    }
                }

                await editEvent(eventData, token, event.data.id)
            }

            const res = await publishSponsor(data, token);
            setSponsors([...sponsors,res.data.data])
            setModalShow(false)
        } catch (error) {
            console.log("Error in publishing sponsor", error)
        }
    }

    const handleSubmit = async () => {
        try {
            let token = Cookies.get("event_auth");
            token
                ? (token = JSON.parse(token).access_token)
                : new Error("Please, Sign in again");

            sponsors.map((value) => {
                updateSponsor({data : value},token);
            })
            toast.success('Sponsor Updated Successfully', {
                duration: 2000,
            });
            router.push(`/conferences/admin/c/${event.data.id}/sessions`)
        } catch (error) {
            console.log("Error in updating sponsors",error)   
        }
    }

    const publishEvent = async () => {
        try {
            let token = Cookies.get("event_auth");
            token
                ? (token = JSON.parse(token).access_token)
                : new Error("Please, Sign in again");
            
            const eventData = {
                data: {
                    attributes: {
                        name: event.data.attributes.name,
                        description: event.data.attributes.description,
                        "starts-at": event.data.attributes["starts-at"],
                        "ends-at": event.data.attributes["ends-at"],
                        "original-image-url": event.data.attributes["original-image-url"],
                        "logo-url": event.data.attributes["logo-url"],
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "is-sponsors-enabled": true,
                        state : "published"
                    },
                    id: event.data.id,
                    type: "event"
                }
            }

            await editEvent(eventData, token, event.data.id)

            handleSubmit();
        } catch (error) {
            console.log("Error in publishing event",error)
        }
    }

    useEffect(() => {
        const sponsorInfo = async () => {
            try {
                let token = Cookies.get("event_auth");
                token
                    ? (token = JSON.parse(token).access_token)
                    : new Error("Please, Sign in again");

                const res = await getSponsorsDetails(event.data.id, token)
                setSponsors(res.data.data)
            } catch (e) {
                console.error("An error occurred while fetching Sponsors", e);
            }
        };
        sponsorInfo();
    }, [])

    return (
    <>
        <div className="m-3">
            <Stack className={styles.speaker_add_btn}>
                <Button onClick={() => { setModalShow(true) }}>Add Sponsors</Button>
            </Stack>
            <SponsorModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleAddSponsor={handleAddSponsor}
                modalHandleChange={modalHandleChange}
                load={load}
            />
            <SponsorList
                sponsors={sponsors}
                handleChange={handleChange}
                handleDelete={handleDelete}
            />
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Next
              </Button>
              {
                event.data.attributes.state === "draft" && <Button
                variant="success"
                onClick={publishEvent}
                type="submit"
              >
                Publish
              </Button>
              }
            </ButtonGroup>
        </div>
    </>);
};

const SponsorList = (props) => {
    return(
        <ListGroup>
                {Array.isArray(props.sponsors) && props.sponsors.length
                    ? props.sponsors.map((spon, id) => {
                        return (<div className="my-2"><ListGroupItem key={spon.id}>
                            <Container>
                                <Row className="align-items-baseline">
                                    <Col>
                                        <span>#{id + 1}</span>
                                    </Col>
                                    <Col className={styles.event_speaker_delete}>
                                        <Button
                                            variant={"danger"}
                                            id={spon.id}
                                            onClick={() => {props.handleDelete(id)}}
                                        >
                                            Delete
                                        </Button>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        required
                                        onChange={e => {props.handleChange(e,id)}}
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        defaultValue={spon.attributes.name}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        onChange={e => {props.handleChange(e,id)}}
                                        name="description"
                                        as="textarea"
                                        type="textarea"
                                        placeholder="A short sweet biography"
                                        defaultValue={spon.attributes.description}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>URL</Form.Label>
                                    <Form.Control
                                        type="url"
                                        onChange={e => {props.handleChange(e,id)}}
                                        name="url"
                                        placeholder="https://link-to.image"
                                        defaultValue={spon.attributes.url}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Logo-Url</Form.Label>
                                    <Form.Control
                                        type="url"
                                        onChange={e => {props.handleChange(e,id)}}
                                        name="logo-url"
                                        placeholder="https://link-to.image"
                                        defaultValue={spon.attributes["logo-url"]}
                                    />
                                </Form.Group>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Level</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        onChange={e => {props.handleChange(e,id)}}
                                        name="level"
                                        placeholder="0"
                                        defaultValue={spon.attributes.level}
                                        min="0"
                                    />
                                    <InputGroup.Text>Type</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        onChange={e => {props.handleChange(e,id)}}
                                        name="type"
                                        placeholder="Gold"
                                        defaultValue={spon.attributes.type}
                                    />
                                </InputGroup>
                            </Container>
                        </ListGroupItem>
                        </div>
                        );
                    })
                    : <i className="text-center text-secondary">No Sponsor found</i>}
            </ListGroup>
    )
}

const SponsorModal = (props) => {
    const { handleAddSponsor, modalHandleChange } = props;
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Sponsor
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleAddSponsor}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            onChange={modalHandleChange}
                            type="text"
                            name="name"
                            placeholder="Name"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            onChange={modalHandleChange}
                            name="description"
                            as="textarea"
                            type="textarea"
                            placeholder="A short sweet biography"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>URL</Form.Label>
                        <Form.Control
                            type="url"
                            onChange={modalHandleChange}
                            name="url"
                            placeholder="https://link-to.image"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Logo-Url</Form.Label>
                        <Form.Control
                            type="url"
                            onChange={modalHandleChange}
                            name="logo-url"
                            placeholder="https://link-to.image"
                        />
                    </Form.Group>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Level</InputGroup.Text>
                        <Form.Control
                            type="number"
                            onChange={modalHandleChange}
                            name="level"
                            placeholder="0"
                            min="0"
                        />
                        <InputGroup.Text>Type</InputGroup.Text>
                        <Form.Control
                            type="text"
                            onChange={modalHandleChange}
                            name="type"
                            placeholder="Gold"
                        />
                    </InputGroup>
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
