import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const API_KEY_SECRET = process.env.API_KEY_SECRET || "default_secret_key";

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY_SECRET) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid API key" });
    return;
  }

  next();
};
