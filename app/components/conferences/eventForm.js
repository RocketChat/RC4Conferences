import {
  Form,
  InputGroup,
  Toast,
} from "react-bootstrap";
import { EventImage } from "./display/EventImage";

export const EventForm = ({ handleChange, handleImageChange, intialValues, ticket , handleSwitch, handlePublicSwitch, isPublic }) => {
  
  return (
    <>
      <EventImage intialValues={intialValues} handleImageChange={handleImageChange} />
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
          value = {ticket.name}
          placeholder={
            ticket.state ? "Free Ticket Name" : "Free Registration Name"
          }
        />
        <Form.Control
          required
          name="quantity"
          type="number"
          value = {ticket.quantity}
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

