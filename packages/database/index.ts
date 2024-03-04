import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./src/schema";
export * from "./src/schema";
export * from "drizzle-orm";
import postgres from "postgres";

export const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = postgres(connectionString, { max: 5 });
const db = drizzle(sql, { schema });

export default db;
