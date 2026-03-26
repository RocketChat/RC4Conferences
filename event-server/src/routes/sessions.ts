import { Router, Request, Response, RequestHandler } from "express";
import { getSessionsCollection } from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";
import { resolveEventId } from "../db/eventLookup";
import { ISession } from "../types";

const router = Router();
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

// Get all sessions
router.get("/", (async (_: Request, res: Response) => {
  try {
    const sessionsCollection = getSessionsCollection();
    const sessions = await sessionsCollection.find().toArray();
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get sessions by event id
router.get("/event/:eventId", (async (req: Request, res: Response) => {
  try {
    const eventId = await resolveEventId(req.params.eventId);
    const sessionsCollection = getSessionsCollection();

    if (eventId === null) {
      return res.json({ success: true, data: [] });
    }

    const sessions = await sessionsCollection
      .find({ event_id: eventId })
      .toArray();
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get session by id
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const sessionsCollection = getSessionsCollection();

    const session = await sessionsCollection.findOne({ id });
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Create new session
router.post("/", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const newSession: ISession = req.body as ISession;
    const sessionsCollection = getSessionsCollection();

    if (newSession.id === undefined || newSession.id === null) {
      newSession.id = generateId();
    }

    const existingSession = await sessionsCollection.findOne({
      id: newSession.id,
    });
    if (existingSession) {
      return res
        .status(409)
        .json({ success: false, message: "Session already exists" });
    }

    const result = await sessionsCollection.insertOne(newSession);
    if (!result.acknowledged) {
      throw new Error("Failed to insert session");
    }

    res.status(201).json({ success: true, data: newSession });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Update session
router.put("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const sessionsCollection = getSessionsCollection();

    const result = await sessionsCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const updatedSession = await sessionsCollection.findOne({ id });
    res.json({ success: true, data: updatedSession });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Delete session
router.delete("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const sessionsCollection = getSessionsCollection();

    const result = await sessionsCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

export default router;
