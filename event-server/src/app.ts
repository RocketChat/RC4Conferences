import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import eventRoutes from "./routes/events";
import speakerRoutes from "./routes/speakers";
import sessionRoutes from "./routes/sessions";
import fileRoutes from "./routes/files";
import cmsRoutes from "./routes/cms";

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

// Basic request logger
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// Production Middleware
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development ease, enable properly in production
}));
app.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key", "x-filename"],
}));
app.use(express.json({ limit: "2mb" }));
app.use(logger);

// Routes
app.use("/v1/cms", cmsRoutes);
app.use("/v1/events", eventRoutes);
app.use("/v1/speakers", speakerRoutes);
app.use("/v1/sessions", sessionRoutes);
app.use("/v1/files", fileRoutes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/test", (_, res) => {
  res.status(200).json({ status: "test-ok" });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal Server Error" 
      : err.message
  });
});

export default app;
