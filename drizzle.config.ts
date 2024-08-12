import type { Config } from 'drizzle-kit';

import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

export default {
  schema: './src/db/schema/**.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
