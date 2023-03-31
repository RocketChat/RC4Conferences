import {
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState, Fragment, useEffect } from "react";

export const EventForm = ({ handleChange, intialValues, ticket, handleSwitch, handlePublicSwitch, isPublic }) => {

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Event name*</Form.Label>
        <Form.Control
          required
          name="name"
          type="text"
          placeholder=""
          value={intialValues.name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Event Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          type="text"
          placeholder=""
          value={intialValues.description}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Event Banner Image URI</Form.Label>
        <Form.Control
          name="original-image-url"
          type="url"
          placeholder="https://via.placeholder.com/1920x960.png"
          value={intialValues["original-image-url"]}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Event Organizer logo</Form.Label>
        <Form.Control
          name="logo-url"
          type="url"
          placeholder="https://via.placeholder.com/100.png"
          value={intialValues["logo-url"]}
          onChange={handleChange}
        />
      </Form.Group>

      <OrganizerForm handleChange={handleChange} intialValues={intialValues} ></OrganizerForm>

      <Form.Group className="mb-3">
        <Form.Label>Start Date*</Form.Label>
        <Form.Control
          required
          name="starts-at"
          type="datetime-local"
          value={intialValues["starts-at"]}
          min={intialValues["start-at"]}
          onChange={handleChange}
          placeholder=""
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>End Date*</Form.Label>
        <Form.Control
          required
          name="ends-at"
          type="datetime-local"
          value={intialValues["ends-at"]}
          min={intialValues["start-at"]}
          onChange={handleChange}
          placeholder=""
        />
      </Form.Group>
      <InputGroup className="mb-3">
        <InputGroup.Text>Ticketed Event</InputGroup.Text>
        <InputGroup.Text aria-label="Switch-group">
          <Form.Check
            aria-label="Switch"
            name="switch"
            onChange={handleSwitch}
            type="switch"
            value={"on"}
            defaultChecked={!ticket.state}
          />
        </InputGroup.Text>
        <InputGroup.Text>Registration</InputGroup.Text>
        <Form.Control
          required
          name="name"
          type="text"
          onChange={handleSwitch}
          value={ticket.name}
          placeholder={
            ticket.state ? "Free Ticket Name" : "Free Registration Name"
          }
        />
        <Form.Control
          required
          name="quantity"
          type="number"
          value={ticket.quantity}
          min={1}
          onChange={handleSwitch}
          placeholder="Quantity"
        />
      </InputGroup>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check onChange={handlePublicSwitch} checked={isPublic} type="checkbox" label="Make this event public (Role-based access not required)" />
      </Form.Group>
    </>

  );
};

const OrganizerForm = ({ handleChange, intialValues }) => {

  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log(intialValues);
    if (intialValues["owner-name"] || intialValues["owner-description"]) {
      setShow(true);
    }
  }, [intialValues])


  return (
    <Fragment>
      {!(intialValues["owner-name"] || intialValues["owner-description"]) ? <InputGroup className="mb-3">
        <InputGroup.Text>Add Organizer Or Group Information</InputGroup.Text>
        <InputGroup.Text aria-label="Switch-group">
          <Form.Check
            aria-label="Switch"
            name="switch"
            onChange={() => setShow(!show)}
            type="switch"
            value={"on"}
            defaultChecked={show}
          />
        </InputGroup.Text>
      </InputGroup> : null
      }
      {show && (
        <><Form.Group className="mb-3">
          <Form.Label>Organizer or Group Name</Form.Label>
          <Form.Control
            required
            name="owner-name"
            type="text"
            placeholder=""
            value={intialValues["owner-name"]}
            onChange={handleChange} />
        </Form.Group>
          {/* About the organization or Group */}
          <Form.Group className="mb-3">
            <Form.Label>About the Organizer or Group </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="owner-description"
              type="text"
              placeholder=""
              value={intialValues["owner-description"]}
              onChange={handleChange} />
          </Form.Group>
        </>
      )}
    </Fragment>
  );
}

