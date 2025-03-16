import express from "express";
import cors from "cors";
import eventRoutes from "./routes/events";
import speakerRoutes from "./routes/speakers";
import sessionRoutes from "./routes/sessions";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/v1/events", eventRoutes);
app.use("/v1/speakers", speakerRoutes);
app.use("/v1/sessions", sessionRoutes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
