import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable in .env"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        const conn = await mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
        });

        console.log("✅ MongoDB connected successfully");
        return conn;
      } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB");
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; 
    throw err;
  }

  return cached.conn;
}
