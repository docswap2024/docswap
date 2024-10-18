import {
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';

export type NewCart = typeof carts.$inferInsert;
export type Cart = typeof carts.$inferSelect;


export const carts = pgTable('carts', {
    userId: varchar('user_id', { length: 255 }).notNull(),
    fileIds: varchar('file_ids', { length: 255 }).array()
});
