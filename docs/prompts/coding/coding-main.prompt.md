# coding-main.prompt.md

## Agent Instructions

Agent must follow all the steps exactly as described below. Must run the Mandatory Final Step at the end.
STRICT EXAMPLE PARITY: All generated source and spec files in this Coding phase MUST adhere exactly to the structures, naming, ordering, and content patterns defined by their respective `*.prompt.md` / `*.example.md` documents in this directory tree. Only substitute documented placeholders (e.g., coverage thresholds, flag names) and dynamic literal values (like application name); do NOT alter style, add undocumented props, change test wording, or reorder exports. Any required divergence MUST be explicitly justified in the final summary and immediately reflected by updating the originating example/prompt to prevent drift. Every runtime `.vue`/`.ts` (excluding pure interface declarations) must have a colocated spec with mirrored file stem and approved test pattern.

## Prerequisites
Already present from previous phases:
- Environment files: `.env.example`, `.env.local` (with full feature flags enabled)
- Ambient types: `src/env.d.ts`
- Env accessors: `src/shared/EnvConsts.ts`
- Path alias `@/*` configured in `tsconfig.json`
- Basic router: `src/router/index.ts` (now includes `/` and `/product-listing` routes)
- Theme forwarding: `src/theme/index.scss` and tokens `src/theme/tokens.scss`
- Feature flags doc: `FEATURE_FLAGS.md` (optional but present)

## Objective
Coordinate the execution of all sub-prompts (components, data, design, layout, views, store) to produce a Vue 3 (Options API) grocery ecommerce UI scaffold centered on the homepage and expanded with product listing, product details, and a functional cart view. Global layout (`LayoutDefault.vue`) supplies Header/Footer across all routes, removing duplication in views. Cart functionality uses a Vuex module for persistent in-memory session state and surfaces subtotal in the Header.

## Included Prompt Sets
- Layout: `layout/layout.prompt.md` defining global chrome wrapper `LayoutDefault.vue`.
- Components (Individual): each `*.prompt.md` in `components/` (carousel, product-card, header, price-tag, cart-summary-badge, category-grid, deal-badge, footer, promotion-banner, search-bar).
- Components (Aggregate): `components/component-main.prompt.md` generates ALL components + spec files in one run.
- Data: `data-models.prompt.md` for domain interfaces and mock data.
- Design: `design-tokens.prompt.md` for SCSS + CSS variable tokens.
- Views: `homepage.prompt.md` (landing), `product-listing.prompt.md` (catalog grid), `product-details.prompt.md` (single item detail), `cart.prompt.md` (cart management & checkout modal).
- Store: `store/cart-store.prompt.md` documents cart module; `store/cart-store.example.md` provides implementation snapshot.
- Router: `router.prompt.md` documenting multi-route setup with parent layout.
- Feature Flags: `feature-flags.prompt.md` enumerates and describes UI gating booleans consumed by Homepage and future zones.

## Execution Modes
Phase 3 supports two strategies. The default is the Single-Run Aggregate mode; use Incremental only if the user explicitly requests it.

1. Single-Run Aggregate (DEFAULT): execute this `coding-main.prompt.md` to generate ALL required files (components, views, layout, store, mocks, specs, tokens, interfaces) in one pass. Do not split into sub-prompts unless asked. After generation, OUTPUT (do not execute) the following exact user instruction block and wait for confirmation:
	```
	Start the development server to validate the generated application:

		 npm run dev

	Once it starts without errors and the homepage loads at http://localhost:3000/, reply "Dev server running" so we can proceed.
	```
	Do NOT display or suggest build or test commands in this phase unless the user explicitly asks.

2. Incremental Feature-by-Feature (ON EXPLICIT REQUEST): run prompts one-by-one in this order, verifying output and colocated specs after each. For components choose ONE approach: (A) single `/component-main` or (B) individual component prompts.
	1. Feature Flags (`feature-flags.prompt.md`)
	2. Data Models (`data-models.prompt.md`)
	3. Design Tokens (`design-tokens.prompt.md`)
	4. Components (`/component-main` OR individual component prompts)
	5. Layout (`layout/layout.prompt.md`)
	6. Router integration & main mounting
	7. Homepage View (`homepage.prompt.md`)
	8. Product Listing View (`product-listing.prompt.md`)
	9. Product Details View (`product-details.prompt.md`)
	10. Cart View (`cart.prompt.md`)
   11. Store (`store/cart-store.prompt.md` + root store wiring)
   12. (Optional) Tests aggregation if user explicitly requests (`npm test`).

In incremental mode, only run tests when the user explicitly instructs; otherwise defer and simply ensure specs are generated.

When running incrementally (only if requested), after each step assert:
 - All newly generated `.vue` / `.ts` files have a colocated `*.spec.ts` sibling (same directory, PascalCase match + `.spec.ts`).
 - Imports resolve (`tsc --noEmit` clean) before continuing.
 - Feature flags referenced in views/components exist in `EnvConsts` or documented fallback.

## Required Generated Files
| Category | Path | Description |
|----------|------|-------------|
| Interfaces | `src/interfaces/domain.ts` | All domain interfaces exported |
| Tokens | `src/theme/tokens.scss` | SCSS variables + :root CSS custom properties |
| Components | `src/components/*.vue` | One SFC per component (generated via `/component-main` or individual prompts) |
| Layout | `src/layout/LayoutDefault.vue` | Global layout wrapping all views (Header + router-view + Footer) |
| Main Entry | `src/main.ts` | Application bootstrap: env shim assignment, global styles import (`./theme/index.scss`), router + store creation/mount (import order: env shim -> styles -> router/store -> root component) |
| Views | `src/views/HomepageView.vue`, `src/views/ProductListingView.vue`, `src/views/ProductDetailsView.vue` | Homepage assembly + product listing grid + single product details (no direct Header/Footer) |
| HTTP Service | `src/services/http.ts` | Preconfigured Axios instance (10s timeout, JSON headers) |
| Store | `src/store/index.ts`, `src/store/cart.ts` | Vuex 4 root store + cart module |
| Cart View | `src/views/CartView.vue` | Cart items list, subtotal, increment/decrement, checkout modal |
| Mocks | `src/mocks/data.mock.ts` | Sample arrays for products, categories, promotions, slides |
| Tests | Colocated `*.spec.ts` next to each `.vue`, store module, and layout (e.g., `src/components/Header.spec.ts`, `src/layout/LayoutDefault.spec.ts`, `src/views/HomepageView.spec.ts`, `src/views/ProductListingView.spec.ts`, `src/views/ProductDetailsView.spec.ts`, `src/views/CartView.spec.ts`, `src/store/cart.spec.ts`) | Jest + vue-test-utils specs |

## Spec File Generation Rules
Every generated module must include a colocated spec file:
- Naming: `ComponentName.vue` -> `ComponentName.spec.ts`; `CartView.vue` -> `CartView.spec.ts`; `cart.ts` -> `cart.spec.ts`; `LayoutDefault.vue` -> `LayoutDefault.spec.ts`.
- Location: same directory as the implementation file.
- Minimum contents: mount/render smoke test, one behavior assertion, one accessibility attribute check, and at least one edge case per component/view. Store specs validate initial state and a mutation/action round trip.
- Carousel spec must mock timers for auto-advance.


## Conventions
- Options API only; no Composition API or `<script setup>`.
- Use `PropType<T>` for complex props; emit events declared via `emits: []`.
- Accessibility: implement aria attributes exactly as specified in component prompts. Header uses semantic landmarks (no redundant banner role), labeled nav (`aria-label="Primary navigation"`), search form (`role="search"`), and dynamic `aria-expanded` on hamburger (mobile variant). Product listing view uses semantic list markup (`<ul><li>` wrappers around product cards) rather than `role=list`.
- Styling: rely on globally injected tokens; no magic numbers when a token exists.
 - Responsive Header: uses flexible `minmax()` grid columns; secondary row hidden <960px; stacks primary row items vertically <600px; actions can wrap.
 - Layout may apply `overflow-x:hidden` after responsive wrapping to avoid stray horizontal scroll.
- Tests: at least one behavior, one accessibility attribute, one edge case per component. Header spec asserts logo alt text, nav items length, search emit, navigation to `/product-listing`, and mobile drawer toggle. ProductCard spec asserts button emit and discount presence when `originalPrice` provided. Product listing view spec asserts all products rendered.
 - Header Prop Resilience: `Header`'s `title` prop is optional with a default fallback to `APP_NAME` to eliminate missing required prop warnings; layout still passes `:title` explicitly for clarity.
- Environment access: consume constants from `EnvConsts` (merged env strategy). Fallback warns (does not throw) if `VITE_APP_NAME` or `VITE_API_BASE_URL` missing to avoid blank screen. Shim assigned early in `main.ts` before imports: `globalThis.__VITE_ENV__ = import.meta.env`.
- Carousel: simplified implementation (auto-advance + dot navigation only) without pause/prev/next controls for MVP.
- Router: parent layout route imports `LayoutDefault.vue` and nests child view routes. Views should not import `Header` or `Footer`. Ensure alias `vue` points to `vue/dist/vue.esm-bundler.js` (already assumed).
 - Global Styles Import Order: Inside `src/main.ts`, after the env shim line but before any component/store/router imports, import `'./theme/index.scss'`. This file must in turn import `tokens.scss` as its first SCSS statement. No other style imports precede it. Do NOT duplicate the global style import elsewhere.

## Legacy Aggregate Execution Order (historical)
The previous single-pass sequence is retained for reference but superseded by the Feature-by-Feature mode above:
1. Data models
2. Design tokens
3. Components
4. Mock data
5. Homepage view
6. Product listing view
7. Product details view
8. Cart store module + cart view + header subtotal
9. Router & store mounting in `main.ts`
10. Tests

## Validation Checklist
- TypeScript: no unresolved imports or implicit any.
- Lint: no critical a11y role misuses (product listing uses `<ul><li>`).
- Tests: all passing, carousel timer mocked when testing auto-advance logic.
- Build output: `dist/` produced by Vite after `npm run build`.
 - Spec Coverage: each generated component/view/layout/store module has a colocated `*.spec.ts`.
 - Feature Flags: referenced flags exist and correctly gate UI zones (no runtime undefined access).
 - Tests (optional): If the user explicitly requests test execution, `npm test` must exit 0 with all specs passing; otherwise skip test run in default aggregate flow.
 - Incremental Mode: after each feature step, partial test suite still passes (fast feedback) before proceeding.

## Feature Flags Integration
Homepage ALWAYS renders promotions, carousel, and deals sections; previous gating flags `showPromotions`, `showCarousel`, `showDeals` are DEPRECATED and must not appear in runtime logic (ignored if present in env). Experimental flags (e.g., `betaSearch`, `newBadge`) may be documented but must not hide these baseline sections. If deprecated flags are detected during env parsing, `EnvConsts` should log a non-blocking warning. Product listing currently renders all products (no flags) and may introduce future filtering flags distinct from the deprecated homepage ones.

## Non-Goals
Authentication, persistence (no localStorage or server sync for cart yet), dark theme, advanced performance optimizations, promo codes, tax/shipping calculations.

## Remaining Work / Future Enhancements
- Persistence layer for cart (e.g., localStorage hydration).
- Filtering, sorting, pagination on product listing.
- Mobile header drawer & expanded a11y tests.
- Integration tests for full cart flow (add from listing & details, adjust in cart, checkout).
- 404 fallback route + error boundary.
- Optional router guards for future auth flows.
- Replace placeholder PWA icons (currently reusing `favicon.png`) with multi-size set & maskable icon; enhance manifest with `screenshots`, `prefer_related_applications` if distribution expands.

After any new feature additions, update corresponding prompt/example pairs and extend specs (especially for store & route changes). Maintain stable cart API (mutation/action names) for tests.

## Mandatory Final Step
Before declaring Phase 3 complete, must perform these verifications (read actual files from disk):
1. File Presence: All Required Generated Files table entries exist. No duplicate or stray legacy files (e.g., unused component variants).
2. Spec Parity: Every runtime `.vue` / `.ts` (excluding pure interfaces) has a colocated `*.spec.ts` with meaningful assertions (behavior, accessibility, edge case).
3. Feature Flags: Every referenced flag in components/views appears in `FEATURE_FLAGS.md` (if present) and is parsed into `FEATURE_FLAGS_LIST` without runtime undefined access.
4. Coverage: Global line coverage ≥ configured target ({{coverage_target_lines}}%). Report uncovered meaningful branches if below.
5. Accessibility: Header landmarks, search form role, semantic `<ul><li>` in product listing, aria attributes on carousel dots verified in specs.
6. Theme Loading & Import Order: Verify `src/theme/index.scss` exists and imports `tokens.scss` first; verify `src/main.ts` imports `'./theme/index.scss'` immediately after the env shim and before router/store/component imports (single occurrence only); verify `src/theme/index.scss` contains global resets (*, html, body styles) and CSS custom property exports from tokens.
7. Runtime Smoke: User has run `npm run dev` after agent displayed command block; homepage loads, product listing and details navigate correctly, cart view updates subtotal on quantity changes, no console errors; user replied "Dev server running".
8. Prompt Alignment: Any deviations from examples are reflected in updated prompt files—no silent drift.

Output a concise summary listing: (a) missing or corrected artifacts, (b) coverage percentage, (c) any follow-up prompt adjustments required. Only after passing all checks should the phase be marked complete.
