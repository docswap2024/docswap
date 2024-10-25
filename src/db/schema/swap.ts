import {
    pgTable,
    varchar,
    integer,
    boolean
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';

export type NewSwap = typeof swap.$inferInsert;
export type Swap = typeof swap.$inferSelect;

export type CompleteSwap = typeof swap.$inferSelect & {
    user?: typeof users.$inferSelect;
  };
  
  
export const swap = pgTable('swap', {
    id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileSize: integer('file_size').default(0),
    extension: varchar('extension', { length: 255 }),
    address: varchar('address', {length: 255 }).notNull(),
    tags: varchar('tags', {length: 255 }).notNull(),
    onMarketplace: boolean('on_marketplace').default(false),
    price: varchar('price', {length: 255 }),
    approved: varchar('approved').default('Pending')
});
  