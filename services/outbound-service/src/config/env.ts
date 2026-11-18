import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('campusflow_user'),
  DB_PASSWORD: z.string().default('campusflow_secret'),
  DB_NAME: z.string().default('campusflow_db'),
  DB_CONNECTION_LIMIT: z.coerce.number().default(10),
  RATE_LIMIT_MAX_PER_MINUTE: z.coerce.number().default(120),
  DISPATCH_BATCH_SIZE: z.coerce.number().default(25),
  DISPATCH_DELAY_MS: z.coerce.number().default(200)
});

export const env = envSchema.parse(process.env);
