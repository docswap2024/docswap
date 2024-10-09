import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { addParcelSeeder } from './seeds/add-parcel';

dotenv.config();

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env');

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  try {
    await addParcelSeeder(db);
  } catch (error) {
    console.log('❌ Failed to add file');
  }
};

main().finally(() => process.exit(0));
