import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { getEventsCollection } from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";
import { IEvent } from "../types";

const router = Router();

// Apply authentication to all routes
router.use(authenticateApiKey);

// Get all events
router.get("/", (async (req: Request, res: Response) => {
  try {
    const eventsCollection = getEventsCollection();
    const events = await eventsCollection.find().toArray();
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get event by id
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const eventsCollection = getEventsCollection();

    const event = await eventsCollection.findOne({ id });
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
router.post("/", (async (req: Request, res: Response) => {
  try {
    const newEvent: IEvent = req.body as IEvent;
    const eventsCollection = getEventsCollection();

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
router.put("/:id", (async (req: Request, res: Response) => {
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
router.delete("/:id", (async (req: Request, res: Response) => {
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
