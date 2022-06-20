import { useEffect, useState } from "react"
import { Button, Card, Form } from "react-bootstrap"

export const EventBasicCreate = () => {
    const [formState, setFormState] = useState({
        "starts-at": new Date(),
        "ends-at": new Date(),
        "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    useEffect(() => {
        console.log("useeff", formState)
        const date = new Date()
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        const nativeDefault = date.toISOString().slice(0,16)
        
        setFormState({
            "starts-at": nativeDefault,
            "ends-at": nativeDefault
        })
    }, [])
    console.log("after", formState)

    const handleFormSubmit = (e) => {
        e.preventDefault()
        console.log("published", formState)
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log("calie", value)
        setFormState((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
    return (
        <Card>
            <Card.Header>Hello, Event!</Card.Header>
            <Card.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Event name*</Form.Label>
                        <Form.Control required name="name" type="text" placeholder="" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date*</Form.Label>
                        <Form.Control required name="starts-at" type="datetime-local" value={formState["starts-at"]} min={formState["start-at"]} onChange={handleChange} placeholder="" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date*</Form.Label>
                        <Form.Control required name="ends-at" type="datetime-local" value={formState["ends-at"]} min={formState["start-at"]} onChange={handleChange} placeholder="" />
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Publish
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}