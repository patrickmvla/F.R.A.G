import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { z } from 'zod';
import { DRIZZLE_ORM } from './drizzle.constants';
import * as schema from '../db/schema';

const databaseSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const drizzleProvider: FactoryProvider<NodePgDatabase<typeof schema>> = {
  provide: DRIZZLE_ORM,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');

    const validatedEnv = databaseSchema.parse({
      DATABASE_URL: connectionString,
    });

    const pool = new Pool({
      connectionString: validatedEnv.DATABASE_URL,
      ssl: true,
    });

    return drizzle(pool, { schema });
  },
};
