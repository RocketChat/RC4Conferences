import { Router, Request, Response, RequestHandler } from "express";
import { getEventsCollection } from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";
import { IEvent } from "../types";

const router = Router();
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

// Get all events
router.get("/", (async (req: Request, res: Response) => {
  try {
    const eventsCollection = getEventsCollection();
    const events = await eventsCollection
      .find({}, { sort: { starts_at: 1, id: 1 } })
      .toArray();
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get event by id or identifier
router.get("/:idOrIdentifier", (async (req: Request, res: Response) => {
  try {
    const idOrIdentifier = req.params.idOrIdentifier;
    const eventsCollection = getEventsCollection();

    let query: any;
    if (!isNaN(Number(idOrIdentifier))) {
      query = { id: parseInt(idOrIdentifier) };
    } else {
      query = { identifier: idOrIdentifier };
    }

    const event = await eventsCollection.findOne(query);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Create new event
router.post("/", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const newEvent: IEvent = req.body as IEvent;
    const eventsCollection = getEventsCollection();
    
    // Preserve provided ID or generate a new one
    if (newEvent.id === undefined || newEvent.id === null) {
      newEvent.id = generateId();
    }

    if (!newEvent.identifier) {
      newEvent.identifier = `event-${newEvent.id}`;
    }
    // Check if the event already exists based on the identifier
    const existingEvent = await eventsCollection.findOne({
      identifier: newEvent.identifier,
    });
    if (existingEvent) {
      return res
        .status(409)
        .json({ success: false, message: "Event already exists" });
    }

    const result = await eventsCollection.insertOne(newEvent);
    if (!result.acknowledged) {
      throw new Error("Failed to insert event");
    }

    res.status(201).json({ success: true, data: newEvent });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Update event
router.put("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const eventsCollection = getEventsCollection();

    const result = await eventsCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const updatedEvent = await eventsCollection.findOne({ id });
    res.json({ success: true, data: updatedEvent });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Delete event
router.delete("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const eventsCollection = getEventsCollection();

    const result = await eventsCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

export default router;
