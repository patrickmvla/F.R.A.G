import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  tenantId: text('tenant_id').unique().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  tenantId: text('tenant_id').references(() => tenants.tenantId),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
