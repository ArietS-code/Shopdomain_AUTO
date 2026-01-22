# Prompt System Overview

This document consolidates the conventions, placeholders, phases, and standards driving automated code generation for `ai-in-action-workshop-level2-ui` while code generation is currently paused.

## 1. Application Summary
`ai-in-action-workshop-level2-ui` is a Vue 3 + Vite + TypeScript frontend using ONLY the Options API. It enforces strict 1:1 colocated unit tests for every runtime `.ts` and `.vue` module (excluding pure interface/type-only files under `src/interfaces`). Global SCSS design tokens are injected automatically via Vite `scss.additionalData`.

## 2. Placeholders
| Placeholder | Value |
|-------------|-------|
| `{{application_name}}` | ai-in-action-workshop-level2-ui |
| `{{dev_server_port}}` | 3000 |
| `{{coverage_target_lines}}` | 80 |
| `{{build_output_entry}}` | dist/js/app.js |

Additional implicit placeholders may appear in examples (e.g., Node/NPM versions) and are resolved as: Node 22.x, NPM 11.x.

## 3. Generation Phases
1. Initialization Phase
   - Directories scaffolded: `src/` subfolders (`router`, `store`, `services`, `interfaces`, `components`, `views`, `shared`, `theme`, `assets`) and `public/`.
   - Core files: `src/main.ts`, `src/App.vue`, `public/index.html`.
   - Theme directory only (no `vars.scss` or `index.scss` yet).
   - Planning for core modules (router, http service, store, HomeView) & associated spec files.
2. Building Phase (pending / paused)
   - Tooling & configuration: `package.json`, `vite.config.ts`, `tsconfig.json`, `jest.config.cjs`, `eslint.config.js`, plus optional formatting/linting support files.
3. Coding Phase
   - Runtime modules: `router/index.ts`, `services/http.ts`, `store/index.ts`, `views/HomeView.vue`, interfaces, shared utilities.
   - Theme partial creation: `src/theme/vars.scss` and forwarding file `src/theme/index.scss`.
4. Testing Phase
   - Colocated spec creation: mandatory initial specs + enforcing future 1:1 mapping.

### 3.1 Phase Quickstart Summary (Command → Outcome → Validation)
| Phase | Command | Primary Outcome | Minimal Validation Loop |
|-------|---------|-----------------|-------------------------|
| Initialization | `/application-initial` | Baseline folders + entry files | Diff vs prompt, commit clean baseline |
| Building | `/building-main` | Tooling & config files generated | `npm install`, `npm run lint`, `npm test -- --passWithNoTests` |
| Coding | `/coding-main` (+ targeted prompts) | Feature modules (router, store, services, components, views, theme) | `npm run dev` (no console errors), imports use `@/` alias |
| Testing | `/testing-main` | Colocated specs & coverage structure | `npm test` (≥80% lines), inspect failing assertions |

Phase Completion Signals:
- Initialization: Structure matches prompt & committed.
- Building: Lint/test/build all succeed; no high severity audit issues.
- Coding: Dev server runs cleanly; tokens resolve; environment vars loaded via `EnvConsts`.
- Testing: Coverage gate reached; no skipped critical specs.

Quick Ongoing Loop (after any phase):
```bash
npm run lint
npm test
npm run build
```

## 4. Mandatory Initial Spec Files
Upon coding phase execution these must exist:
- `src/main.spec.ts`
- `src/router/index.spec.ts`
- `src/services/http.spec.ts`
- `src/store/index.spec.ts`
- `src/views/HomeView.spec.ts`

## 5. Architectural Conventions
- Options API only: no Composition API, no `<script setup>`.
- Each module has a colocated spec file for behavioral validation.
- SCSS global tokens via `@use "@/theme/" as *;` (configured in Vite). Theme partials forwarded through `src/theme/index.scss` using `@forward`.
- Alias `@` maps to `src`.
- Build output entry: `dist/js/app.js` (Rollup `entryFileNames: 'js/app.js'`).
- Dev server port: 3000.

## 6. Vite Configuration Requirements
- `defineConfig(({ command, mode }) => { ... })`
- Conditional CSS injection: `isBuild && cssInjectedByJsPlugin({ styleId: <appId> })`
- SVG loader with svgo preset-default override `removeViewBox: false`.
- SCSS preprocessor additionalData: `@use "@/theme/" as *;`
- Rollup output: entryFileNames `js/app.js`, chunkFileNames `js/[name].js`, assetFileNames `assets/[name][extname]`, `format: 'system'`, `exports: 'auto'`.

## 7. Runtime / Dev Dependencies (Target Set)
Runtime:
- vue, vue-router, axios, vuex, vue-class-component

Dev:
- vite, @vitejs/plugin-vue, vite-svg-loader, vite-plugin-css-injected-by-js
- typescript, vue-tsc, @types/node
- jest, ts-jest, @vue/test-utils, @vue/vue3-jest, @types/jest
- eslint, eslint-plugin-vue, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- prettier, stylelint (+ config packages), husky, lint-staged, cross-env, sass

## 8. Testing Standards
- Framework: Jest + @vue/test-utils + @vue/vue3-jest
- Coverage: global lines >= 80%
- Behavior-first assertions; minimal implementation detail inspection.
- 1:1 spec rule enforced for all runtime `.ts` and `.vue` files.

## 9. File Generation Expectations (Coding Phase)
Each generated module must include: implementation + colocated spec. Example pairs:
| Module | Spec |
|--------|------|
| `src/main.ts` | `src/main.spec.ts` |
| `src/router/index.ts` | `src/router/index.spec.ts` |
| `src/services/http.ts` | `src/services/http.spec.ts` |
| `src/store/index.ts` | `src/store/index.spec.ts` |
| `src/views/HomeView.vue` | `src/views/HomeView.spec.ts` |

## 10. Prohibitions
- No Composition API (`setup()`, `<script setup>`).
- No manual theme imports in `main.ts`.
- No snapshot tests early in lifecycle.
- No Docker / SonarQube files for local dev.

## 11. Prompt Mapping
| Purpose | Prompt File |
|---------|-------------|
| Initialization | `application-initial.prompt.md` |
| Build/tooling | `building/building-main.prompt.md` + examples |
| Coding standards | `coding/coding-main.prompt.md` |
| Homepage view specifics | `coding/homepage.prompt.md` |
| Testing standards | `testing/testing-main.prompt.md` |

## 12. Next Actions (When Resuming)
1. Execute Building Prompt to create config files.
2. Install dependencies (`npm install`).
3. Generate coding-phase modules + specs.
4. Run tests & enforce coverage.

### 12.1 Version Pinning Strategy
To ensure reproducible builds and avoid unintended upgrades:
- Use exact versions (no caret ^ or tilde ~) for all dependencies once generated.
- Pin dev tooling (Jest, ESLint, Prettier, Stylelint, Vite plugins) similarly.
- Commit the lockfile (`package-lock.json`) to VCS.
- Perform upgrades in isolated groups (test stack, build stack, linting stack) validating after each.
- Record changes in a future `docs/DEPENDENCY-UPDATES.md` (date, old version, new version, reason).
- For security patches, prefer the minimal direct dependency bump first.
- After any version change: `rm -rf node_modules package-lock.json && npm install` then run lint + test before commit.

Illustrative initial pins (finalize during building phase):
- vue 3.x latest stable
- vue-router 4.x latest stable
- vuex 4.x latest stable
- axios 1.x latest
- vite 5.x latest
- vite-svg-loader latest compatible
- vite-plugin-css-injected-by-js latest
- jest 29.x latest
- @vue/test-utils latest Vue 3 compatible
- @vue/vue3-jest matching Jest 29
- ts-jest matching Jest 29
- typescript 5.x latest stable
- eslint 9.x (flat config) latest
- prettier 3.x latest
- stylelint, stylelint-config-standard, stylelint-config-html latest
- lint-staged latest
- husky latest

### 12.2 Resumption Checklist
Use this quick list when un-pausing generation:
- [ ] Confirm prompt files unchanged / reviewed
- [ ] Generate `package.json` with pinned versions
- [ ] Generate `tsconfig.json` (strict flags) & `vite.config.ts` (port 3000, output path js/app.js, System format)
- [ ] Create `eslint.config.js`, `jest.config.cjs`
- [ ] Add `stylelint.config.json`, `.prettierrc`, lint-staged config, `.gitignore`
- [ ] Initialize Husky hooks (pre-commit runs lint-staged; optional pre-push runs tests)
- [ ] Install dependencies (`npm install`)
- [ ] Scaffold runtime source & matching specs (1:1 rule)
- [ ] Verify global SCSS injection works (class style smoke test)
- [ ] Run `npm test` ensure coverage >= 80% lines
- [ ] Run linting & formatting checks (ESLint, Stylelint, Prettier) all pass
- [ ] Commit baseline state
- [ ] Begin iterative feature development

## 13. Maintenance Guidelines
- Any new `.ts`/`.vue` file must ship with a corresponding spec in the same directory.
- Update Vite config if adding new global style partials (ensure they are forwarded in `index.scss`).
- Keep dependency upgrades aligned with major version ranges defined here.

## 14. Status
Code generation is paused. Repository currently contains only initialization scaffold (if created earlier) or is ready to generate from prompts.

---
End of Prompt System Overview.
