import { Router, Request, Response, RequestHandler } from "express";
import { getSpeakersCollection } from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";
import { resolveEventId } from "../db/eventLookup";
import { ISpeaker } from "../types";

const router = Router();
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

// Get all speakers
router.get("/", (async (_: Request, res: Response) => {
  try {
    const speakersCollection = getSpeakersCollection();
    const speakers = await speakersCollection
      .find({}, { sort: { is_featured: -1, id: 1 } })
      .toArray();
    res.json({ success: true, data: speakers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Get speakers by event id
router.get("/event/:eventId", (async (req: Request, res: Response) => {
  try {
    const eventId = await resolveEventId(req.params.eventId);
    const speakersCollection = getSpeakersCollection();

    if (eventId === null) {
      return res.json({ success: true, data: [] });
    }

    const speakers = await speakersCollection
      .find({ event_id: eventId }, { sort: { is_featured: -1, id: 1 } })
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
    const eventId = req.query.event_id
      ? parseInt(req.query.event_id as string)
      : null;
    const speakersCollection = getSpeakersCollection();

    const speaker = await speakersCollection.findOne(
      eventId === null ? { id } : { id, event_id: eventId }
    );
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

router.post("/bulk", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const speakers: ISpeaker[] = req.body as ISpeaker[];
    const speakersCollection = getSpeakersCollection();

    // Ensure all speakers have IDs by generating them for those that don't
    const processedSpeakers = speakers.map((speaker) => {
      if (speaker.id === undefined) {
        return {
          ...speaker,
          id: generateId(),
        };
      }
      return speaker;
    });

    // Process all speakers using bulkWrite with upserts
    const bulkOps = processedSpeakers.map((speaker) => ({
      updateOne: {
        filter: { id: speaker.id, event_id: speaker.event_id },
        update: { $set: speaker },
        upsert: true, // This creates the document if it doesn't exist
      },
    }));

    // Execute bulk operations
    const bulkResult = await speakersCollection.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      data: {
        updated: bulkResult.modifiedCount,
        inserted: bulkResult.upsertedCount,
        total: bulkResult.modifiedCount + bulkResult.upsertedCount,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);
// Create new speaker
router.post("/", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const newSpeaker: ISpeaker = req.body as ISpeaker;
    const speakersCollection = getSpeakersCollection();
    
    // Preserve provided ID or generate a new one
    if (newSpeaker.id === undefined || newSpeaker.id === null) {
      newSpeaker.id = generateId();
    }

    // Speaker IDs are scoped to their event in the source datasets.
    const existingSpeaker = await speakersCollection.findOne({
      id: newSpeaker.id,
      event_id: newSpeaker.event_id,
    });
    if (existingSpeaker) {
      return res
        .status(409)
        .json({ success: false, message: "Speaker already exists" });
    }
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
router.put("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const speakersCollection = getSpeakersCollection();
    const eventId = updateData.event_id;
    const filter = eventId === undefined ? { id } : { id, event_id: eventId };

    const result = await speakersCollection.updateOne(
      filter,
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found" });
    }

    const updatedSpeaker = await speakersCollection.findOne(filter);
    res.json({ success: true, data: updatedSpeaker });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Delete speaker - supports both id and name as query parameters
router.delete("/", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const { id, name } = req.query;
    const speakersCollection = getSpeakersCollection();

    // Validate that at least one parameter is provided
    if (!id && !name) {
      return res.status(400).json({
        success: false,
        message: "Either 'id' or 'name' query parameter must be provided",
      });
    }

    let result;

    // Delete based on provided parameter
    if (id) {
      const numericId = parseInt(id as string);
      if (isNaN(numericId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format. ID must be a number",
        });
      }
      result = await speakersCollection.deleteOne({ id: numericId });
    } else {
      // Delete by name
      result = await speakersCollection.deleteOne({ name: name });
    }

    // Check if any document was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found",
      });
    }

    res.json({
      success: true,
      message: "Speaker deleted successfully",
      data: { deletedCount: result.deletedCount },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Add bulk delete endpoint
router.delete("/bulk", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const { ids, name } = req.body;
    const speakersCollection = getSpeakersCollection();

    // Validate that at least one parameter is provided
    if ((!ids || !Array.isArray(ids) || ids.length === 0) && !name) {
      return res.status(400).json({
        success: false,
        message:
          "Either 'ids' array or 'name' must be provided in request body",
      });
    }

    let result;

    if (ids && Array.isArray(ids)) {
      // Convert all ids to numbers
      const numericIds = ids.map((id) => parseInt(id));
      result = await speakersCollection.deleteMany({ id: { $in: numericIds } });
    } else if (name) {
      // Delete all speakers with the given name
      result = await speakersCollection.deleteMany({ name });
    }
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No matching speakers found",
      });
    }
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching speakers found",
      });
    }

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} speaker(s)`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Optional: Keep the ID-based endpoint for backward compatibility
router.delete("/:id", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const speakersCollection = getSpeakersCollection();

    const result = await speakersCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found" });
    }

    res.json({
      success: true,
      message: "Speaker deleted successfully",
      data: { deletedCount: result.deletedCount },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);
export default router;
