import { migrate } from "drizzle-orm/postgres-js/migrator";
import db, { sql } from "..";

const migration = async () => {
  console.log("migrating....");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("migration is successfull");

  await sql.end();
};

migration();
