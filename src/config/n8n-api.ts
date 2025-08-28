import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { getRequestContext, getSessionN8nConfig } from './runtime-context';

// n8n API configuration schema
const n8nApiConfigSchema = z.object({
  N8N_API_URL: z.string().url().optional(),
  N8N_API_KEY: z.string().min(1).optional(),
  N8N_API_TIMEOUT: z.coerce.number().positive().default(30000),
  N8N_API_MAX_RETRIES: z.coerce.number().positive().default(3),
});

// Track if we've loaded env vars
let envLoaded = false;

// Parse and validate n8n API configuration
export function getN8nApiConfig() {
  // Load environment variables on first access
  if (!envLoaded) {
    dotenv.config();
    envLoaded = true;
  }
  // 1) Per-session override (multi-tenant): prefer config bound to current request/session
  try {
    const ctx = getRequestContext();
    const sessionConfig = getSessionN8nConfig(ctx?.sessionId);
    if (sessionConfig && sessionConfig.baseUrl && sessionConfig.apiKey) {
      return {
        baseUrl: sessionConfig.baseUrl,
        apiKey: sessionConfig.apiKey,
        timeout: sessionConfig.timeout ?? 30000,
        maxRetries: sessionConfig.maxRetries ?? 3,
      };
    }
  } catch (e) {
    // Do not fail on context errors; fall back to env
  }

  // 2) Fallback to environment-level configuration
  const result = n8nApiConfigSchema.safeParse(process.env);
  if (!result.success) {
    return null;
  }
  const config = result.data;
  if (!config.N8N_API_URL || !config.N8N_API_KEY) {
    return null;
  }
  return {
    baseUrl: config.N8N_API_URL,
    apiKey: config.N8N_API_KEY,
    timeout: config.N8N_API_TIMEOUT,
    maxRetries: config.N8N_API_MAX_RETRIES,
  };
}

// Helper to check if n8n API is configured (lazy check)
export function isN8nApiConfigured(): boolean {
  const config = getN8nApiConfig();
  return config !== null;
}

// Type export
export type N8nApiConfig = NonNullable<ReturnType<typeof getN8nApiConfig>>;