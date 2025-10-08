import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import { config } from '../config/env.js';

const sql = neon(config.DATABASE_URL)

export const db = drizzle(sql);