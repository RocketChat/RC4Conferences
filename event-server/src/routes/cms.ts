import { Router, Request, Response, RequestHandler } from "express";
import {
  getCarouselsCollection,
  getPersonasCollection,
  getGuidesCollection,
  getReleaseNotesCollection,
  getTopNavCollection,
  getFormsCollection,
} from "../db/collections";
import { authenticateApiKey } from "../middleware/auth";

const router = Router();

const getCarousels: RequestHandler = async (req, res) => {
  try {
    const data = await getCarouselsCollection().find().toArray();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postCarousels: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getCarouselsCollection();
    await collection.deleteMany({});
    if (Array.isArray(data)) {
      await collection.insertMany(data);
    } else {
      await collection.insertOne(data);
    }
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonas: RequestHandler = async (req, res) => {
  try {
    const data = await getPersonasCollection().find().toArray();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postPersonas: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getPersonasCollection();
    await collection.deleteMany({});
    if (Array.isArray(data)) {
      await collection.insertMany(data);
    } else {
      await collection.insertOne(data);
    }
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getGuide: RequestHandler = async (req, res) => {
  try {
    const data = await getGuidesCollection().findOne();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postGuide: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getGuidesCollection();
    await collection.deleteMany({});
    await collection.insertOne(data);
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getReleaseNote: RequestHandler = async (req, res) => {
  try {
    const data = await getReleaseNotesCollection().findOne();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postReleaseNote: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getReleaseNotesCollection();
    await collection.deleteMany({});
    await collection.insertOne(data);
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getTopNav: RequestHandler = async (req, res) => {
  try {
    const data = await getTopNavCollection().findOne();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postTopNav: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getTopNavCollection();
    await collection.deleteMany({});
    await collection.insertOne(data);
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getForms: RequestHandler = async (req, res) => {
  try {
    const data = await getFormsCollection().find().toArray();
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getFormById: RequestHandler = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const data = await getFormsCollection().findOne({ id });

    if (!data) {
      res.status(404).json({ data: null, error: "Form not found" });
      return;
    }

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const postForms: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const collection = getFormsCollection();
    await collection.deleteMany({});
    if (Array.isArray(data)) {
      await collection.insertMany(data);
    } else {
      await collection.insertOne(data);
    }
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.get("/carousels", getCarousels);
router.post("/carousels", authenticateApiKey, postCarousels);
router.get("/personas", getPersonas);
router.post("/personas", authenticateApiKey, postPersonas);
router.get("/guide", getGuide);
router.post("/guide", authenticateApiKey, postGuide);
router.get("/release-note", getReleaseNote);
router.post("/release-note", authenticateApiKey, postReleaseNote);
router.get("/top-nav-item", getTopNav);
router.post("/top-nav-item", authenticateApiKey, postTopNav);
router.get("/forms", getForms);
router.get("/forms/:id", getFormById);
router.post("/forms", authenticateApiKey, postForms);

export default router;
