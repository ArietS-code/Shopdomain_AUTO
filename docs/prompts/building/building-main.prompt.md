# Frontend Building Main Prompt

## Agent Instructions

Please follow all the steps described in this document and use the examples that are provided, additionally at the end of the file generation you must execute the `Mandatory Final Verification Step` that is at the end of this document.
IMPORTANT: Every file you generate or update in this Building phase MUST match its corresponding example file in this directory byte-for-byte (character-for-character) except for explicit placeholder substitutions (e.g., `{{application_name}}`, version pins, ports, coverage numbers). Do NOT introduce formatting, ordering, or structural deviations. If an intentional deviation is required, you MUST: (1) list it under Output Validation with a justification, and (2) update the related example markdown so the prompt and example remain synchronized. Silent drift is prohibited.

## Goal
Generate build & tooling configuration for `{{application_name}}` ensuring the project runs on Node {{node_version}} / npm {{npm_version}}, supports Vue 3 (Options API), TypeScript, Jest unit tests (80% lines coverage), and Vite-based build on port {{dev_server_port}} with output entry file `dist/js/app.js`. Incorporate lessons learned from prior iteration: proactive inclusion of jsdom environment, stable Jest 29.x alignment, proper Vue test utils CJS mapping, and deprecation-safe Husky setup.

## Files To Generate / Update
Use the example markdown files in this same directory as authoritative references. Summarize each before generating.

1. `package.json`
2. `vite.config.ts`
3. `tsconfig.json`
4. `jest.config.cjs` (+ `tests/setup/jest.pre-env.cjs`, `tests/setup/jest.setup.cjs`)
5. `.browserslistrc` (optional; can be inferred from target modern browsers)
6. `.npmrc`
7. `.prettierrc` (from `prettier-config-example.md`)
8. `.prettierignore` (from `prettier-ignore-example.md`)
9. `eslint.config.cjs` (from `eslint-config-example.md`)
10. `.stylelintrc.json` (from `stylelint-config-example.md`)
11. `.lintstagedrc.json` (from `lint-staged-config-example.md`)
12. `.gitignore` (from `gitignore-example.md`)

Ensure a single root-level `index.html` exists (do NOT duplicate under `public/`). Vite's production build resolves this file; absence produces: `Could not resolve entry module "index.html"`. It must include `<div id="app"></div>` and a module script pointing to `/src/main.ts`. The `public/` directory is reserved solely for static assets (`favicon.png`, `manifest.webmanifest`, `robots.txt`) that need to be copied verbatim. Add the following tags to the head:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials" />
```
Generate an initial `public/manifest.webmanifest` during or immediately after this phase with placeholder icons reusing `favicon.png` (to be replaced by multi-size exports later).

(Exclude Dockerfile and sonar-project.properties: not required for local dev.)

## Required Scripts (package.json)
- `dev`: `vite`
- `build`: `vite build`
- `preview`: `vite preview`
- `test:unit`: `jest --passWithNoTests`
- `test:coverage`: `jest --coverage`
- `lint`: `eslint . --ext .ts,.vue`
- `lint:style`: `stylelint "src/**/*.{css,scss,vue}"`
- `format`: `prettier --write .`

REMOVE any `prepare` script (Husky install command deprecated). Use manual hooks.

## Dependencies (Initial Minimal Set)
Runtime:
- vue
- vue-router
- axios
- vuex
  (Removed `vue-class-component`: Options API only project does not require it.)

Dev:
- typescript
- vite
- @vitejs/plugin-vue
- vite-svg-loader
- vite-plugin-css-injected-by-js
- sass
- @types/node
- vue-tsc
- jest (29.x family)
- jest-environment-jsdom (29.x aligned)
- jest-environment-jsdom (pin to same 29.x line as Jest)
- ts-jest (29.x compatible)
- @vue/test-utils
- @vue/vue3-jest
- @vue/compiler-sfc (explicit to avoid transformer gaps)
- @vue/compiler-dom (ensures compiler APIs for test utils)
- eslint + eslint-plugin-vue + @typescript-eslint/parser + @typescript-eslint/eslint-plugin
- prettier
- stylelint + stylelint-config-standard + stylelint-config-html
- husky (manual hook creation; no prepare script)
- lint-staged
- cross-env

(Adjust versions to latest stable or mirror reference project; lock major versions. Ensure all Jest ecosystem packages share the same major/minor.)

## Placeholders
Support same placeholders as initialization prompt plus `{{dev_server_port}}` and `{{build_output_entry}}`.

## Constraints
- Engines field must pin `node` to `>= {{node_version}}` and `npm` to `>= {{npm_version}}`.
- Jest coverage threshold lines: `{{coverage_target_lines}}`.
- Dev server port: `{{dev_server_port}}`.
- Rollup output entry file name: `js/app.js` within `dist/`.

## Vite Build Output Requirements
Configure Rollup build in `vite.config.ts`:
```ts
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'js/app.js',
      chunkFileNames: 'js/[name].js',
      assetFileNames: 'assets/[name][extname]'
    }
  }
}
```

## Required Plugins in `vite.config.ts`
- `@vitejs/plugin-vue`
- `vite-svg-loader` (for direct SVG imports)
- `vite-plugin-css-injected-by-js` (inject compiled CSS via JS for dynamic loading)

## Example Reference Files
Agent must read and copy structure (replacing placeholders only) from:
- `package-json-example.md`
- `vite-config-example.md`
- `tsconfig-example.md`
- `jest-config-example.md`
- `eslint-config-example.md`
- `stylelint-config-example.md`
- `lint-staged-config-example.md`
- `prettier-config-example.md`
 - `prettier-ignore-example.md`
- `gitignore-example.md`

## Output Validation
After generation, reread all produced files and verify:
- Placeholders replaced
- Scripts exist
- Coverage threshold correct
- Vite server port set to 3000
- Rollup output entry file path resolves to `dist/js/app.js`
- SVG loader & CSS injected-by-JS plugins present
- Stylelint, Prettier, lint-staged configurations match examples exactly
- Root `index.html` exists at project root and references `/src/main.ts`; no duplicate `public/index.html` present.
 - Note: Environment variable scaffolding (`.env.example`, `.env.local`, `EnvConsts.ts`) is produced in the subsequent Configuring phase, not here. Ensure `.gitignore` already excludes `.env.local` so it will not be committed when created.
 - Add `src/env.d.ts` only in Configuring phase; however, prepare `tsconfig.json` now with `"types": ["node", "jest", "vite/client"]` to enable ambient env typing.
 - `.gitignore` must contain:
   ```
   .env.local
   .env
   .env.*.local
   !.env.example
   ```
   to avoid accidental commits of local overrides while retaining the example template.

## Agent Instructions
1. Summarize each example file.
2. Generate configuration files.
3. Verify and list any deviations with justification.
 4. When finished, PROMPT THE USER to run ONLY:
   ```
   npm install
   ```
   No other commands (build, dev, test, preview) are executed in this Building phase.
 5. After a successful install (no peer/unmet dependency errors), proceed to the Configuring phase. Do NOT run `npm run build` until Configuring completes.

# Building Prompt (Main)

You are generating the build & tooling setup for the Vue 3 application.
Follow these strict requirements:

## Toolchain & Versions
- Node: 22.x
- NPM: 11.x
- Vite 5.x + Vue 3 (Pinned to a stable Vite 5 release because current `@vitejs/plugin-vue@4.x` peer range is `^4 || ^5`. We intentionally avoid Vite 6/7 until the plugin publishes a compatible major. Document upgrade path in README: monitor `@vitejs/plugin-vue` release notes; once a version supporting Vite 6/7 is stable, bump both together.)
- TypeScript strict mode
- Jest for unit tests (ts-jest + @vue/vue3-jest)
- ESLint (flat config) + Prettier
- SCSS enabled via `sass` package
- Plugins: `vite-svg-loader`, `vite-plugin-css-injected-by-js`
 - Known benign warning: Dart Sass legacy JS API deprecation appears during dev/build (triggered by Vite internal use of `sass.render`). Safe to ignore; monitor Vite for migration before Sass 2.0.

## Dependencies (runtime)
Include:
- vue (3.x)
- vue-router (4.x)
- axios (1.x)
- vuex (4.x)
// Removed `vue-class-component` (not needed; strict Options API only)

## Dev Dependencies
Include:
- @vitejs/plugin-vue
- vite-svg-loader
- vite-plugin-css-injected-by-js
- typescript
- jest, ts-jest, @types/jest
- @vue/test-utils, @vue/vue3-jest
- eslint, eslint-plugin-vue, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- prettier
- sass
- stylelint, stylelint-config-standard, stylelint-config-html
- husky, lint-staged

## Scripts
Provide scripts:
- dev
- build
- preview
- test (with coverage)
- lint
- format

## Vite Configuration
Implement a `vite.config.ts` with:
- `defineConfig(({ command, mode }) => ( ... ))` form
- `isBuild` flag (`command === 'build'`)
- Plugins array including:
  - `vue()` always
  - `isBuild && cssInjectedByJsPlugin({ styleId: <appId> })` filtered out when false
  - `svgLoader({ svgo: true, svgoConfig: { plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] } })`
- Aliases: `@` -> `src`, `vue` -> explicit path
- `server.port = 3000`
- Rollup output forcing single entry file: `entryFileNames: 'js/app.js'`, chunkFileNames `'js/[name].js'`, assets pattern `'assets/[name][extname]'`, `format: 'system'`, `exports: 'auto'`
- `css.preprocessorOptions.scss.additionalData` with `@use "@/theme/" as *;` so global theme tokens are injected automatically (DO NOT import theme scss manually in `main.ts`)

## Global Styles
- No direct SCSS import in `main.ts` for theme tokens
- Theme SCSS files live under `src/theme/`
- Additional component-scoped styles can still use `<style lang="scss">`
 - Note: `src/theme/vars.scss` and `src/theme/index.scss` are introduced during the Coding phase; Vite `scss.additionalData` assumes their existence post-coding.

## Testing Config
`jest.config.cjs` (or `.js`) must:
- Use jsdom environment (provided by installed `jest-environment-jsdom`)
- Use ts-jest for TS transform & `@vue/vue3-jest` for `.vue`
- Provide `setupFiles` and `setupFilesAfterEnv` pointing to `tests/setup/jest.pre-env.cjs` and `tests/setup/jest.setup.cjs`
- Map `.vue` via `@vue/vue3-jest`
- Add `moduleNameMapper` entry forcing CJS: `'^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'`
- Exclude `src/App.vue` (shell) and `src/main.ts` from coverage collection
- Coverage threshold lines: 80%
- Test match pattern supports colocated `*.spec.ts` inside `src`

## ESLint Flat Config
- Enable Vue essential rules
- TypeScript parser config for `.ts` & `.vue`
- Prettier integration (can be via ignore of formatting concerns or plugin if needed)

## TypeScript Config
- Strict true
- IsolatedModules true
- SkipLibCheck true
- ESNext module/target
- JSX preserve (future-proofing; unused now is acceptable)
 - Include `"types": ["node", "jest", "vite/client"]` so future `src/env.d.ts` augmentation resolves `import.meta.env`.

## Package.json Example
Replicate structure from `package-json-example.md` exactly, only adjusting name/version/placeholders if required.

## Output
Generate:
1. `package.json` (based on example)
2. `vite.config.ts` (based on updated example)
3. `tsconfig.json` (from example)
4. `jest.config.cjs` (from example)
5. `eslint.config.js` or `eslint.config.cjs` (flat config example)
6. `.stylelintrc.json`
7. `.lintstagedrc.json`
8. `.prettierrc`
9. `.prettierignore`
10. `.gitignore`

Ensure all examples are followed verbatim with only placeholder substitutions.

## Prohibitions
- No Docker files
- No SonarQube config
- No Composition API usage in example code
- No manual theme import in `main.ts`

## Validation
After generation verify:
- All dependencies present (including vuex & vue-class-component)
- Vite config includes conditional `cssInjectedByJsPlugin`
- SCSS additionalData configured
- Rollup output path enforced
- Stylelint, Prettier, lint-staged, gitignore match examples

Return a success summary after generation including:
- Confirmed Husky manual hooks (no prepare script)
- Jest version alignment with environment package
- Presence of setup files directory `tests/setup/`
- Inclusion of compiler-sfc & compiler-dom
- CJS mapping for test utils
- Statement on handling `@vitejs/plugin-vue` peer dependency with Vite 7 (pin or accept warning).

## Mandatory Final Verification Step

After generating all the files described in this document, read the generated files from disk and make sure that the contents of the files match the example contents and the placeholder replacement was done properly.

THEN OUTPUT (do not execute) a final user instruction block exactly in this form:
```
Run the following command to install dependencies for the newly generated build tooling:

  npm install

After it finishes without peer/unmet dependency errors, reply "Install complete" so we can proceed to the Configuring phase.
```
Do NOT show or suggest any other command (no build/dev/test). Do NOT proceed until the user confirms the install succeeded. This phase ends only after user confirmation.