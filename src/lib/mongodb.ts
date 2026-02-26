import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const globalForMongoose = globalThis as unknown as {
  _mongoosePromise: Promise<typeof mongoose> | undefined;
};

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  if (!globalForMongoose._mongoosePromise) {
    globalForMongoose._mongoosePromise = mongoose.connect(MONGODB_URI);
  }

  await globalForMongoose._mongoosePromise;
}
