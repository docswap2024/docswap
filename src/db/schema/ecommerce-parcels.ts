import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export type NewParcel = typeof ecommerceParcels.$inferInsert;
export type Parcel = typeof ecommerceParcels.$inferSelect;

export type ParcelFolder = typeof ecommerceParcels.$inferSelect;

export interface CompleteParcelBreadcrumbs {
  id: string;
  name: string;
  type: string;
}

export const ecommerceParcels = pgTable('ecommerce_parcels', {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mime: varchar('mime', { length: 255 }),
  fileSize: integer('file_size').default(0),
  userId: varchar('user_id', { length: 255 }).notNull(),
  parentId: varchar('parent_id', { length: 255 }),
  type: varchar('type', { length: 255 }),
  streetNumber: varchar('street_number', { length: 10 }),
  streetName: varchar('street_name', { length: 255 }),
  subArea: varchar('sub_area', { length: 255 }),
  city: varchar('city', { length: 255 }),
  stateProvince: varchar('state_province', { length: 255 }),
  postalCode: varchar('postal_code', { length: 255 }),
  country: varchar('country', { length: 255 }),
  pid: varchar('pid', { length: 255 }),
  extension: varchar('extension', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
