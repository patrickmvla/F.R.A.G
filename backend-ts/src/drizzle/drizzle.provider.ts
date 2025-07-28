import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE_ORM } from './drizzle.constants';
import * as schema from '../db/schema';
import { FactoryProvider } from '@nestjs/common';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const DrizzleProvider: FactoryProvider = {
  provide: DRIZZLE_ORM,

  inject: [],
  useFactory: () => {
    const { DATABASE_URL } = envSchema.parse(process.env);

    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: true, // Required for Neon
    });

    const db = drizzle(pool, { schema });
    return db;
  },
};
