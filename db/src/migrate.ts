import { fileURLToPath } from "node:url";
import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDb } from "./client.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const { pool, db } = createDb();
  const migrationsFolder = path.join(dirname, "..", "drizzle");
  await migrate(db, { migrationsFolder });
  await pool.end();
  console.log("[db] migrations applied from", migrationsFolder);
}

main().catch((error) => {
  console.error("[db] migration failed:", error);
  process.exit(1);
});
