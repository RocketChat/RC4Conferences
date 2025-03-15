import { Router, Request, Response, RequestHandler } from "express";
import { getSpeakersCollection } from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";
import { ISpeaker } from "../types";

const router = Router();

// Apply authentication to all routes
router.use(authenticateApiKey);

// Get all speakers
router.get("/", (async (_: Request, res: Response) => {
  try {
    const speakersCollection = getSpeakersCollection();
    const speakers = await speakersCollection.find().toArray();
    res.json({ success: true, data: speakers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get speakers by event id
router.get("/event/:eventId", (async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const speakersCollection = getSpeakersCollection();

    const speakers = await speakersCollection
      .find({ event_id: eventId })
      .toArray();
    res.json({ success: true, data: speakers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get speaker by id
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const speakersCollection = getSpeakersCollection();

    const speaker = await speakersCollection.findOne({ id });
    if (!speaker) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found" });
    }

    res.json({ success: true, data: speaker });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Create new speaker
router.post("/", (async (req: Request, res: Response) => {
  try {
    const newSpeaker: ISpeaker = req.body as ISpeaker;
    const speakersCollection = getSpeakersCollection();

    const result = await speakersCollection.insertOne(newSpeaker);
    if (!result.acknowledged) {
      throw new Error("Failed to insert speaker");
    }

    res.status(201).json({ success: true, data: newSpeaker });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Update speaker
router.put("/:id", (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const speakersCollection = getSpeakersCollection();

    const result = await speakersCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found" });
    }

    const updatedSpeaker = await speakersCollection.findOne({ id });
    res.json({ success: true, data: updatedSpeaker });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Delete speaker
router.delete("/:id", (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const speakersCollection = getSpeakersCollection();

    const result = await speakersCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found" });
    }

    res.json({ success: true, message: "Speaker deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

export default router;
