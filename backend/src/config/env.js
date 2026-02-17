import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '../..');

// Load backend/.env first to avoid accidentally reading unrelated root env files.
dotenv.config({ path: path.join(backendRoot, '.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(24, 'JWT_SECRET must be at least 24 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  FRONTEND_URLS: z.string().optional(),
  FRONTEND_ORIGIN_REGEX: z.string().optional(),
  TRUST_PROXY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  throw new Error(`Invalid environment variables:\n${errors.join('\n')}`);
}

export const env = parsed.data;

export const isProd = env.NODE_ENV === 'production';

const parseCsvList = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseOriginRegexList = (value = '') =>
  parseCsvList(value).map((pattern) => {
    try {
      return new RegExp(pattern, 'i');
    } catch {
      throw new Error(`Invalid FRONTEND_ORIGIN_REGEX pattern: ${pattern}`);
    }
  });

const parseTrustProxy = (value) => {
  if (!value) {
    return isProd ? 1 : false;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }

  const maybeNumber = Number(normalized);
  if (Number.isInteger(maybeNumber) && maybeNumber >= 0) {
    return maybeNumber;
  }

  return value.trim();
};

export const allowedFrontendOrigins = [
  env.FRONTEND_URL,
  ...parseCsvList(env.FRONTEND_URLS)
];

export const allowedFrontendOriginPatterns = parseOriginRegexList(env.FRONTEND_ORIGIN_REGEX);

export const trustProxy = parseTrustProxy(env.TRUST_PROXY);
