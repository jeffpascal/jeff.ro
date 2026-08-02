import { MongoClient, Db } from "mongodb";

declare global {
  var _jeffroMongoPromise: Promise<MongoClient> | undefined;
}

/** Returns null when MONGODB_URI is not configured — callers degrade gracefully
 *  (email-only) instead of crashing the request. */
export function getDb(): Promise<Db> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!global._jeffroMongoPromise) {
    global._jeffroMongoPromise = new MongoClient(uri).connect();
  }
  const dbName = process.env.MONGODB_DB_NAME || "jeffro";
  return global._jeffroMongoPromise.then((c) => c.db(dbName));
}
