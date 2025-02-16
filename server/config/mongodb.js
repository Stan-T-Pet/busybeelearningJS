import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in your .env file

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing from .env file");
}

let client;
let clientPromise;

const options = {
  useNewUrlParser: true, //Required for MongoDB Atlas
  useUnifiedTopology: true, //Ensures stable connection
};

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

export default clientPromise;