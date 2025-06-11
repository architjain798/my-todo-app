// app/db/schema.ts
import { serial, text, boolean, integer, pgTable } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  done: boolean('done').default(false).notNull(),
  priority: integer('priority').default(1).notNull(),
});