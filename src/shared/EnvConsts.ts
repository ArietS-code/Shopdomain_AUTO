/**
 * Centralized environment constant access with validation.
 * 
 * Uses hierarchical fallback merge to support both Vite runtime (import.meta.env)
 * and Jest test environment (process.env).
 */

// Merge strategy: process.env (lowest) → import.meta.env (direct) → shim injection (highest)
let directMetaEnv: Record<string, any> = {};
try {
  directMetaEnv = (import.meta as any).env || {};
} catch {
  // import.meta unavailable (e.g., in some test contexts)
}

const viteShim = (globalThis as any).__VITE_ENV__ || {};
const procEnv = typeof process !== 'undefined' ? process.env : {};
const mergedEnv = { ...procEnv, ...directMetaEnv, ...viteShim };

/**
 * Asserts that a required environment variable is present.
 * @param value - The value to check
 * @param name - The variable name for error messages
 * @throws {Error} If the value is missing or empty
 */
function assertPresent(value: string | undefined, name: string): void {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

/** Application display name */
export const APP_NAME: string = mergedEnv.VITE_APP_NAME || 'ai-in-action-workshop-level2-ui';

/** Base URL for API calls */
export const API_BASE_URL: string = mergedEnv.VITE_API_BASE_URL || 'http://localhost:3000/api';

/** Comma-separated feature flags (optional) */
export const FEATURE_FLAGS: string = mergedEnv.VITE_FEATURE_FLAGS || '';

// Validate required variables
assertPresent(APP_NAME, 'VITE_APP_NAME');
assertPresent(API_BASE_URL, 'VITE_API_BASE_URL');
// FEATURE_FLAGS is optional; no assertion

/**
 * Parsed feature flags as array of trimmed strings.
 * Empty string splits are filtered out.
 */
export const FEATURE_FLAGS_LIST: string[] = FEATURE_FLAGS
  .split(',')
  .map((f) => f.trim())
  .filter(Boolean);
