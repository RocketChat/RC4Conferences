import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/event_management";

let dbInstance: Db | null = null;
let client: MongoClient | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    dbInstance = client.db();
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};
