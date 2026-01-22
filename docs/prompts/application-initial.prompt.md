# Application Initialization Prompt

You are initializing a Vue 3 + Vite + TypeScript application using the Options API.

## Agent Instructions

Agent must follow all the steps exactly as described below. Must run the Mandatory Final Step at the end.

## Placeholders
- {{application_name}}: ai-in-action-workshop-level2-ui
- {{dev_server_port}}: 3000
- {{coverage_target_lines}}: 80
- {{build_output_entry}}: dist/js/app.js

## Directories to Create
```
src/
  main.ts
  App.vue
  router/
  store/
  services/
  interfaces/
  components/
  views/
  shared/
  theme/
  assets/
tests/
  setup/  (placeholder directory; actual Jest setup files generated in Building phase)
public/
  (static assets only: `favicon.png`, `manifest.webmanifest`, `robots.txt`)  # Provide at least a 32x32 PNG favicon. Manifest added later.
index.html  # Root-level entry HTML required for both dev & production build entry; Vite resolves this during `vite build`.
```

## Core Initial Files
Create:
1. `src/main.ts` (bootstraps app)
2. `src/App.vue` (root component with minimal template `<template><router-view /></template>` and Options API script block if needed)
3. `index.html` at project root (single authoritative entry containing `<div id="app"></div>` and module script to `/src/main.ts`). Missing this file causes build error: `Could not resolve entry module "index.html"`. It must also declare favicon & (later) manifest links:
  ```html
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials" />
  ```
4. Do NOT create `src/theme/vars.scss` or `src/theme/index.scss` yet (these belong to Coding phase). Do NOT create Jest setup files yet; only create the empty `tests/setup/` directory.

## Planned Core Modules (generated in Coding phase)
Scaffold modules each with a colocated spec file:
- `src/router/index.ts` (Vue Router setup with base route `/` → `HomepageView.vue`). Initial placeholder route is acceptable ONLY before the view exists; once `HomepageView.vue` is created, replace the inline template component to avoid a blank screen and runtime template compiler warnings.
- `src/services/http.ts` (Axios instance with baseURL `/`, timeout 10000, JSON headers) + `http.spec.ts`
- `src/store/index.ts` (Vuex 4 empty store scaffold) + `index.spec.ts`
- `src/views/HomepageView.vue` (assembled homepage) + `HomepageView.spec.ts`

## Initial Mandatory Spec Files (created in Coding phase but listed here for planning)
- `src/main.spec.ts` (colocated with entry if created)
- `src/router/index.spec.ts`
- `src/services/http.spec.ts`
- `src/store/index.spec.ts`
- `src/views/HomeView.spec.ts`
All specs follow the colocation rule: they reside next to the file they test, not in central `__tests__` directories.

## Theme / Global Styles
- Do NOT import theme SCSS manually in `main.ts`.
- Global design tokens will be provided via Vite `scss.additionalData` (`@use "@/theme/" as *;`) once theme partials are added in Coding phase.
- Structure (introduced later): individual partials (e.g., `vars.scss`, later `mixins.scss`) forwarded via `index.scss`.

## 1:1 Test Rule
Every `.ts` and `.vue` file (excluding pure type-only files under `interfaces/`) must have a colocated `*.spec.ts` file. This rule becomes effective starting the Coding phase.

## Deferred Configuration Files
The following will be generated in the Building phase (do not create now):
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `jest.config.cjs`
- `eslint.config.js` (flat config)

## Phase Sequence After Initialization
1. **Building Phase** – Generate tooling configs and test/lint infrastructure.
2. **Configuring Phase** – Run `configuring-main.prompt.md` to create environment variable scaffolding (`.env.example`, `.env.local`), `src/shared/EnvConsts.ts`, `src/env.d.ts`, optional `FEATURE_FLAGS.md`, and `sonar-project.properties`. (Router and theme files deferred to Coding phase.)
3. **Coding Phase** – Run `coding-main.prompt.md` to produce domain interfaces, design tokens, components, feature flag utilities, views, mocks, and tests.
4. **Testing Phase** – Run `testing-main.prompt.md` to enforce coverage thresholds and test conventions.

## After Initialization
Proceed in sequence as above—do not skip Configuring Phase before Coding.

Environment Variable & Typing Files (created during Configuring phase, not now):
- `.env.example` (template, committed) with placeholders: `VITE_APP_NAME={{application_name}}`, `VITE_API_BASE_URL=http://localhost:3000/api`, optional `VITE_FEATURE_FLAGS=`.
- `.env.local` (developer overrides, uncommitted) mirroring example values.
- `src/shared/EnvConsts.ts` providing validated access (`assertPresent`) and JSDoc.
- `src/env.d.ts` declaring ambient interfaces:
  ```ts
  /// <reference types="vite/client" />
  interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_FEATURE_FLAGS?: string; // comma-separated flags
  }
  interface ImportMeta { readonly env: ImportMetaEnv }
  ```
  This enables `import.meta.env` property access without local interface duplication. A runtime shim assigning `globalThis.__VITE_ENV__ = import.meta.env` will be added in `main.ts` during Coding phase to support unified env access for tests via `EnvConsts`.

TypeScript Configuration (generated in Building phase): ensure `tsconfig.json` includes `"types": ["jest", "vite/client"]` so the above ambient declarations resolve.

Return a summary of created folders & files.

## Mandatory Final Step
Before moving to Building phase, validate:
1. Directory Structure: All listed folders exist; no extra tooling/config files generated prematurely.
2. Root `index.html`: Located at repository root, not duplicated under `public/`; contains favicon & manifest link tags and mounts `src/main.ts`.
3. `App.vue`: Uses Options API; template includes `<router-view />` only; no extraneous logic or style imports.
4. `src/main.ts`: Boots Vue app, mounts to `#app`; does NOT import theme SCSS or set env shim yet.
5. Placeholder `tests/setup/` directory present; contains no test config files yet.
6. Public Assets: `favicon.png`, `manifest.webmanifest`, optional `robots.txt` located under `public/` only.
7. No Theme Files: `src/theme/` exists but contains no `tokens.scss` or `index.scss` yet.
8. No Environment Files: `.env.example`, `.env.local`, `EnvConsts.ts` absent (will be generated later in Configuring phase).
9. Prompt Alignment: Any deviations (missing file, incorrect location) fixed by updating this prompt rather than manual edits.

Produce a concise verification summary (pass/fail for each item). Proceed to Building phase only after all checks pass.
