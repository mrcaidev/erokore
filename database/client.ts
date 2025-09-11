import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(
  process.env.MONGO_URL ?? "mongodb://localhost:27017",
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  },
);

export const db = client.db(process.env.MONGO_DB_NAME ?? "erokore");
