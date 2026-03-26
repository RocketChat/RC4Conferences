import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKeySecret = process.env.API_KEY_SECRET;
  const apiKey = req.headers["x-api-key"];

  if (!apiKeySecret) {
    res.status(500).json({
      success: false,
      message: "API_KEY_SECRET is not configured",
    });
    return;
  }

  if (!apiKey || apiKey !== apiKeySecret) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid API key" });
    return;
  }

  next();
};
