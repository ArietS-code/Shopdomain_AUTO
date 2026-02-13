/// <reference types="vite/client" />

/**
 * Ambient type declarations for Vite environment variables.
 * Augments import.meta.env with application-specific properties.
 */
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FEATURE_FLAGS?: string; // comma-separated
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
