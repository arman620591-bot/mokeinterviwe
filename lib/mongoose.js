import mongoose from "mongoose";

const globalForMongoose = globalThis;

const cached = globalForMongoose._mongoose || {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  globalForMongoose._mongoose = cached;

  return cached.conn;
}
