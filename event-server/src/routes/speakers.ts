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
    const speakers = await speakersCollection
      .find({}, { sort: { id: 1 } })
      .toArray();
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
      .find({ event_id: eventId }, { sort: { id: 1 } })
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

// Create many speakers
// Create many speakers
// Create many speakers
router.post("/bulk", (async (req: Request, res: Response) => {
  try {
    const speakers: ISpeaker[] = req.body as ISpeaker[];
    const speakersCollection = getSpeakersCollection();

    // Ensure all speakers have IDs by generating them for those that don't
    const processedSpeakers = speakers.map((speaker) => {
      if (speaker.id === undefined) {
        return {
          ...speaker,
          id: Math.floor(Math.random() * 1000000),
        };
      }
      return speaker;
    });

    // Process all speakers using bulkWrite with upserts
    const bulkOps = processedSpeakers.map((speaker) => ({
      updateOne: {
        filter: { id: speaker.id },
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
router.post("/", (async (req: Request, res: Response) => {
  try {
    const newSpeaker: ISpeaker = req.body as ISpeaker;
    const speakersCollection = getSpeakersCollection();
    // check if the speaker already exists based on the identifier
    const existingSpeaker = await speakersCollection.findOne({
      identifier: newSpeaker.id,
    });

    if (existingSpeaker) {
      return res
        .status(409)
        .json({ success: false, message: "Speaker already exists" });
    }
    // Generate a unique identifier for the new speaker
    newSpeaker.id = Math.floor(Math.random() * 1000000); // Replace with a more robust ID generation method if needed
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

// Delete speaker - supports both id and name as query parameters
router.delete("/", (async (req: Request, res: Response) => {
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

// Optional: Keep the ID-based endpoint for backward compatibility
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
router.delete("/bulk", (async (req: Request, res: Response) => {
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
export default router;
