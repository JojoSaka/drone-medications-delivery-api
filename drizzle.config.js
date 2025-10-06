import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from "./config/env.js"

export default defineConfig({
  out: './drizzle',
  schema: './database/schema.js', 
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});