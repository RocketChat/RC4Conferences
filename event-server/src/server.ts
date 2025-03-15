import app from "./app";
import dotenv from "dotenv";
import { connectDB, closeDB } from "./db/connection";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down server");
    server.close(async () => {
      await closeDB();
      process.exit(0);
    });
  });
});
