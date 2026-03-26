import { Router, Request, Response, RequestHandler } from "express";
import { getGridFS } from "../db/connection";
import { authenticateApiKey } from "../middleware/auth";

const router = Router();

// Get file by filename
router.get("/:filename", (async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const bucket = getGridFS();
    
    const files = await bucket.find({ filename }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "image/png");
    const downloadStream = bucket.openDownloadStreamByName(filename);
    
    downloadStream.on("error", () => {
      res.status(404).json({ success: false, message: "File not found" });
    });

    downloadStream.pipe(res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

// Upload file - Using native stream handling (no multer)
router.post("/", authenticateApiKey, (async (req: Request, res: Response) => {
  try {
    const filename = req.headers["x-filename"] as string;
    const contentType = req.headers["content-type"] as string;

    if (!filename) {
      return res.status(400).json({ success: false, message: "x-filename header is required" });
    }

    const bucket = getGridFS();
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: contentType || "image/png",
    });

    req.pipe(uploadStream);

    uploadStream.on("finish", () => {
      res.status(201).json({ 
        success: true, 
        data: { 
          filename,
          url: `/v1/files/${filename}`
        } 
      });
    });

    uploadStream.on("error", (error) => {
      res.status(500).json({ success: false, message: error.message });
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}) as RequestHandler);

export default router;
