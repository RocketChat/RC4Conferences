import { MongoClient, Db, GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/event_management";

const getSafeMongoUri = (uri: string) =>
  uri.replace(/\/\/.*@/, "//<redacted>@");

let dbInstance: Db | null = null;
let client: MongoClient | null = null;
let gridFSBucket: GridFSBucket | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    dbInstance = client.db();
    await Promise.all([
      dbInstance.collection("events").createIndex({ id: 1 }, { unique: true }),
      dbInstance.collection("events").createIndex(
        { identifier: 1 },
        { unique: true }
      ),
      dbInstance.collection("speakers").createIndex(
        { id: 1 },
        { unique: true }
      ),
      dbInstance.collection("speakers").createIndex({ event_id: 1 }),
      dbInstance.collection("sessions").createIndex(
        { id: 1 },
        { unique: true }
      ),
      dbInstance.collection("sessions").createIndex({ event_id: 1 }),
      dbInstance.collection("forms").createIndex({ id: 1 }, { unique: true }),
    ]);
    gridFSBucket = new GridFSBucket(dbInstance, {
      bucketName: "speaker_images",
    });
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error(
      `MongoDB connection error for ${getSafeMongoUri(MONGODB_URI)}:`,
      error.message
    );
    console.error(
      "Set MONGODB_URI to a reachable MongoDB instance. For local development, use mongodb://127.0.0.1:27017/event_management."
    );
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
};

export const getGridFS = (): GridFSBucket => {
  if (!gridFSBucket) {
    throw new Error("GridFS bucket not initialized. Call connectDB first.");
  }
  return gridFSBucket;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};
