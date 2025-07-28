import { config } from 'dotenv';
import { resolve } from 'path';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

config({ path: resolve(__dirname, '../.env') });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
