import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in your .env file

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing from .env file");
}

// ✅ Add recommended options
const options = { useUnifiedTopology: true, useNewUrlParser: true };

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
}

export default clientPromise; // ✅ Use this in next-auth.js and anywhere MongoDB is needed