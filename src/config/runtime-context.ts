import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  sessionId?: string;
}

export interface N8nSessionConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  maxRetries?: number;
}

// Async context for per-request/session metadata
const contextStorage = new AsyncLocalStorage<RequestContext>();

// Global in-memory map of sessionId -> n8n API config
const sessionConfigMap = new Map<string, N8nSessionConfig>();

export function runWithRequestContext<T>(ctx: RequestContext, fn: () => Promise<T> | T): Promise<T> | T {
  return contextStorage.run(ctx, fn);
}

export function getRequestContext(): RequestContext | undefined {
  return contextStorage.getStore();
}

export function setSessionN8nConfig(sessionId: string, config: N8nSessionConfig): void {
  sessionConfigMap.set(sessionId, config);
}

export function getSessionN8nConfig(sessionId: string | undefined): N8nSessionConfig | undefined {
  if (!sessionId) return undefined;
  return sessionConfigMap.get(sessionId);
}

export function clearSessionN8nConfig(sessionId: string | undefined): void {
  if (!sessionId) return;
  sessionConfigMap.delete(sessionId);
}


