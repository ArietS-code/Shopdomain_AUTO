# configuring-main.prompt.md

# Frontend Configuring Main Prompt

## Agent Instructions

Agent must follow all the steps exactly as described below. Must run the Mandatory Final Step at the end.

## Goal
Generate baseline runtime & developer configurations for `{{application_name}}` enabling environment variables and typed access. (Router and theme scaffolds deferred to Coding phase.)

## Files To Generate (if missing)
1. `.env.local` – local developer overrides (DO NOT commit secrets; provide placeholder variables)
2. `.env` or `.env.example` – documented default environment variables
3. `src/shared/EnvConsts.ts` – typesafe accessors for environment variables
4. `src/env.d.ts` – global ambient typing for `import.meta.env` (reference `vite/client` and augment `ImportMetaEnv`)
5. `sonar-project.properties` – minimal placeholder (if not yet created)
6. (Optional) `FEATURE_FLAGS.md` – documentation for any toggles represented by `VITE_FEATURE_FLAGS` (comma-separated list)

## Environment Variable Convention
- Prefix all public vars with `VITE_` (e.g., `VITE_APP_NAME`, `VITE_API_BASE_URL`).
- Provide placeholders:  
  - `VITE_APP_NAME={{application_name}}`  
  - `VITE_API_BASE_URL=http://localhost:3000/api (placeholder)`
  - `VITE_FEATURE_FLAGS=showPromotions,showCarousel,showDeals` (local defaults enable all documented flags; adjust per developer needs)

## EnvConsts.ts Requirements
### Runtime Access Strategy
Jest cannot parse `import.meta.env` directly in CJS transform scenarios. To keep tests simple we use a hierarchical fallback merge approach:
```ts
let directMetaEnv = {};
try { directMetaEnv = (import.meta as any).env || {}; } catch {}
const viteShim = (globalThis as any).__VITE_ENV__ || {};
const procEnv = typeof process !== 'undefined' ? process.env : {};
const mergedEnv = { ...procEnv, ...directMetaEnv, ...viteShim };
```
Order of precedence: `process.env` (overrides) → `import.meta.env` (direct) → shim injection. During Vite build a light shim assigns `globalThis.__VITE_ENV__ = import.meta.env`; tests lean on `process.env`.

Add this shim in `src/main.ts` once Coding phase begins (after environment files exist):
```ts
(globalThis as any).__VITE_ENV__ = import.meta.env;
```

### Requirements
- Export readonly constants sourced from `mergedEnv`.
- Validate required vars (throw Error with clear message if missing at runtime).
- Provide JSDoc for each constant.
- Ambient typings remain in `src/env.d.ts` (do NOT redeclare).
- Provide parsed feature flags helper (`FEATURE_FLAGS_LIST`).

## Agent Instructions
1. Summarize this prompt and confirm required files.
2. Generate `.env.example` (committed) and `.env.local` (ignored) with documented variables (including `VITE_FEATURE_FLAGS` pre-populated to all known flags: `showPromotions,showCarousel,showDeals`).
3. Generate `src/shared/EnvConsts.ts` with runtime assertions and JSDoc.
4. Generate `src/env.d.ts` with:
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FEATURE_FLAGS?: string; // comma-separated
}
interface ImportMeta { readonly env: ImportMetaEnv }
```
4. Ensure `.gitignore` excludes `.env.local`.
5. (Optional) Generate `FEATURE_FLAGS.md` if flags are introduced.
6. Avoid introducing secrets; only placeholders and localhost defaults.
7. Provide a summary of generated files before proceeding to Coding phase.
 8. AFTER completion, OUTPUT (do not execute) the following exact user instruction block and wait for user confirmation before proceeding to Coding:
  ```
  Run the following command to build and validate environment configuration:

    npm run build

  After it finishes successfully (dist/js/app.js exists and no missing env errors), reply "Build complete" so we can proceed to the Coding phase.
  ```

## Output Validation
- `.env.local` and `.env.example` (or `.env`) exist with the documented variables.
- `EnvConsts.ts` compiles and references variables via `import.meta.env`.

## Example Content Templates
### `.env.example`
```
VITE_APP_NAME={{application_name}}
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FEATURE_FLAGS=
```

### `.env.local`
```
# Local developer overrides
VITE_APP_NAME={{application_name}} (Local)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FEATURE_FLAGS=showPromotions,showCarousel,showDeals
```

### `EnvConsts.ts`
```ts
/** Centralized environment constant access with validation */
export const APP_NAME: string = import.meta.env.VITE_APP_NAME || '{{application_name}}';
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const FEATURE_FLAGS: string = import.meta.env.VITE_FEATURE_FLAGS || '';

function assertPresent(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

assertPresent(APP_NAME, 'VITE_APP_NAME');
assertPresent(API_BASE_URL, 'VITE_API_BASE_URL');
// FEATURE_FLAGS is optional; no assertion

/** Optional parsed feature flags helper */
export const FEATURE_FLAGS_LIST: string[] = FEATURE_FLAGS
  .split(',')
  .map(f => f.trim())
  .filter(Boolean);
```

### Deferred Artifacts
`src/router/index.ts`, theme SCSS entry, tokens, and all components/views are created in the Coding phase.

---
Proceed after summarizing and validating output.
 
## Mandatory Final Step
Before transitioning to Coding phase, must read the generated files from disk and verify:
1. Environment Files: `.env.example` (committed) and `.env.local` (ignored) both exist; `.env.local` contains enabled feature flags if documented.
2. `.gitignore` excludes `.env.local` (and does not exclude `.env.example`).
3. `src/shared/EnvConsts.ts` exports required constants and throws for missing mandatory vars (`VITE_APP_NAME`, `VITE_API_BASE_URL`). Optional flags parse into `FEATURE_FLAGS_LIST` with trimming and filtering.
4. Ambient Types: `src/env.d.ts` matches the specified shape and references `vite/client`.
5. No Tooling Leakage: No build/config files (e.g., `vite.config.ts`, `jest.config.cjs`) were generated prematurely in this phase.
6. Documentation: `FEATURE_FLAGS.md` present if flags used; lists and describes each flag consistently with `.env.local` values.
7. Shim Plan: Comment or note exists (in code or README) reminding that `globalThis.__VITE_ENV__ = import.meta.env` will be set in `main.ts` during Coding.
8. Build Verification: User has run `npm run build` and `dist/js/app.js` exists (agent only displayed command; user executed manually and confirmed "Build complete").
9. Consistency: Any deviations are reflected by updating this prompt first; do not proceed with drift.

Output a short summary listing which files were created and any discrepancies fixed. Only proceed to Coding when all checks pass.
