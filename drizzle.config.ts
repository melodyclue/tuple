import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env file");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: './supabase/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
