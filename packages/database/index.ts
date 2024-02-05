import { drizzle } from "drizzle-orm/postgres-js";
import posstgres from "postgres";
import * as schema from "./src/schema";
export * from "./src/schema";
export * from "drizzle-orm";

const password = "Rbm0DFSZSyTfUbEW";

export const connectionString = `postgresql://postgres:${password}@db.bwqcrlplogotbdffsees.supabase.co:5432/postgres`;

export const sql = posstgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

export default db;
