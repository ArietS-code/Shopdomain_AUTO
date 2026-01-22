# testing-main.prompt.md

# Frontend Testing Main Prompt

## Agent Instructions

Agent must follow all the steps exactly as described below. Must run the Mandatory Final Step at the end.

## Goal
Audit, refine, and enforce testing standards for `{{application_name}}` using Jest + Vue Test Utils to produce deterministic, behavior-focused specs with a minimum **{{coverage_target_lines}}% global line coverage**. If baseline specs were generated during Phase 3 (Coding), this phase HARDENS them—only creating missing specs and enhancing weak ones. It does not blindly regenerate duplicates.

## Phase Role (Post-Coding)
Coding phase may already have produced colocated `*.spec.ts` files. This Testing phase:
1. Verifies spec parity (every executable `.ts` or `.vue` under `src/` except pure interfaces has a sibling `*.spec.ts`).
2. Strengthens assertions (behavior + accessibility + edge cases).
3. Improves coverage strategically (no shallow filler tests).
4. Adds advanced patterns (timer mocking, feature flag toggling, store mutation cycles, event emission verification).
5. Validates environment handling (`EnvConsts`) including failure modes and flag parsing.
6. Detects drift between prompt contracts and existing specs; prompts must be updated FIRST before regenerating changed specs.

## Output Expectations
Running this prompt results in:
* Creation ONLY of missing spec files. Existing specs are patched/enhanced—not duplicated.
* Optional utility additions (e.g., `tests/helpers/timer.ts`) if referenced.
* No changes to runtime implementation files (components, views, services, store). If a runtime change is required to meet testability, update the relevant coding prompt first, regenerate code, then re-run this testing prompt.

## Testing Stack
* Jest (jsdom)
* @vue/test-utils (CJS build mapped via `moduleNameMapper` to avoid global Vue issues)
* ts-jest (ESM mode + `esModuleInterop`)
* @vue/vue3-jest (Vue SFC transform)
* Vite 5 build assumptions (no direct involvement in Jest runtime)
 * Vite alias: `vue: 'vue/dist/vue.esm-bundler.js'` enables runtime template compilation (removes blank screen warning for inline placeholders).

## Conventions
1. Test file naming: `Name.spec.ts` colocated with implementation.
2. 1:1 Mapping: EVERY executable `.ts` and `.vue` file under `src/` must have a sibling spec; pure interface/type-only files (e.g. `src/interfaces/**`) excluded.
3. Minimum Assertions per spec: one render smoke, one behavior outcome, one accessibility assertion, one edge/boundary case.
4. Prefer behavior assertions over implementation details (DOM text, emitted events, visual class changes, aria attributes).
5. Keep tests isolated—no cross-test state leakage; restore timers and mutated env between cases.
6. Mock external modules (Axios services) when logic depends on them (future iterations; placeholder here).
7. Avoid snapshot tests until markup stabilizes; if used, keep lean and pair with explicit assertions.
8. Stub router elements (`router-view`) if warning noise arises: `global: { stubs: { 'router-view': true } }`.
9. Environment constants: test by mutating `process.env` & resetting modules; validate fallback chain (process.env > import.meta.env > shim).
10. Feature flags: override `process.env.VITE_FEATURE_FLAGS`, `jest.resetModules()`, re-import modules.
11. Use `jest.useFakeTimers()` for interval/time-driven components (Carousel) and assert index progression; always restore with `jest.useRealTimers()`.
12. If a spec already meets all criteria, leave it untouched—do not inflate coverage artificially.

## What This Prompt Does When Specs Already Exist
* Audits parity and reports missing spec siblings.
* Enhances weak specs (adds behavior/a11y/edge assertions).
* Injects timer mocking pattern where absent for Carousel.
* Adds EnvConsts negative-path tests if missing.
* Adds store round-trip (mutation → getter/action) test if missing in cart module spec.
* Does NOT regenerate unchanged, healthy specs.

## Gap Detection Checklist
| Area | Required Checks |
|------|-----------------|
| Parity | Every component/view/layout/store/service has a colocated spec |
| Behavior | At least one observable user impact (text change, emitted event) per spec |
| Accessibility | Header nav label, search form role, carousel dot attributes, list semantics in product listing |
| Edge Cases | Empty arrays, missing optional props, discount absence, out-of-range quantity adjustments |
| Feature Flags | Both enabled and disabled render paths tested for flagged zones |
| Store | Mutation + getter or action round trip validated |
| Timers | Carousel auto-advance logic asserted with fake timers |
| Env | Missing required variable throws, malformed flags parse gracefully |

## Coverage Strategy
1. Review coverage report (lines & branches) focusing on meaningful logic first.
2. Add tests for uncovered branches ONLY if they represent actual behavior.
3. Remove dead code instead of writing artificial tests.
4. Re-run until global line coverage ≥ **{{coverage_target_lines}}%**.

## Sample Test Pattern (colocated)
```ts
import { mount } from '@vue/test-utils';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders placeholder content', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.find('h1').text()).toBe('Welcome to {{application_name}}');
  });
});
```

## Coverage
Collect coverage from `src/**/*.{ts,vue}` excluding:
* `src/main.ts`
* `src/App.vue`
* `src/interfaces/**` (type-only)
* Optional tooling or setup files under `tests/setup/` if added
Keep `src/shared/EnvConsts.ts` included to exercise validation logic. Enforce global lines threshold of **{{coverage_target_lines}}%**. Do not exclude complex logic files for convenience.

### Vue Shim Example
Create `src/shims-vue.d.ts`:
```ts
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

Add to Jest `collectCoverageFrom` exclusions:
```js
collectCoverageFrom: [
  'src/**/*.{ts,vue}',
  '!src/main.ts',
  '!src/App.vue',
  '!src/interfaces/**', // optional glob if you segregate interfaces
  '!src/shims-vue.d.ts'
]
```

### EnvConsts Test Example (Positive + Negative)
```ts
describe('EnvConsts', () => {
  const ORIGINAL = { ...process.env };
  afterEach(() => { process.env = { ...ORIGINAL }; jest.resetModules(); });
  it('exposes required variables', () => {
    const { APP_NAME, API_BASE_URL } = require('@/shared/EnvConsts');
    expect(APP_NAME).toBeDefined();
    expect(API_BASE_URL).toMatch(/^http/);
  });
  it('throws when required variable missing', () => {
    process.env.VITE_APP_NAME = '';
    jest.resetModules();
    expect(() => require('@/shared/EnvConsts')).toThrow(/Missing required environment variable: VITE_APP_NAME/);
  });
  it('parses feature flags list (comma + spaces)', () => {
    process.env.VITE_FEATURE_FLAGS = '  showCarousel,showDeals , showPromotions ';
    jest.resetModules();
    const { FEATURE_FLAGS_LIST } = require('@/shared/EnvConsts');
    expect(FEATURE_FLAGS_LIST).toEqual(['showCarousel','showDeals','showPromotions']);
  });
});
```

## Agent Instructions
* For any newly generated runtime file (post-Coding changes), ensure a colocated spec is added immediately.
* Use alias `@` for cross-folder imports; `./` for siblings.
* Avoid global test setup unless required; rely on `moduleNameMapper` for stability.
* If coverage below threshold: list uncovered actionable lines first, then add focused tests.
* Always mock timers (`jest.useFakeTimers()`) in time-driven components and restore afterward.
* Do not create speculative utilities; only add helpers when a pattern repeats across ≥2 specs.
* Do not lower coverage target without workshop lead approval—improve quality instead.
* AFTER executing this prompt, OUTPUT (do not execute) the following exact user instruction block and wait for confirmation:
  ```
  Run the full test suite to validate hardened specs and coverage:

      npm test

  When it finishes with all tests passing and coverage ≥ {{coverage_target_lines}}%, reply "Tests complete" so we can close the Testing phase.
  ```

## Regeneration Rules
* Update prompt files before altering code structure or props.
* Re-run component/view/store prompt for regenerated implementation, THEN re-run `/testing-main` to adjust spec.
* Never manually duplicate a spec file; consolidate into existing spec instead.

## Future (Not in this Iteration)
* Integration tests using @testing-library/vue
* Cypress/Playwright E2E flows
* Advanced mocking for Axios interceptors
* Parity check script (`scripts/check-spec-parity.mjs`)

## Deferred Enhancements
* Visual regression scaffolding
* Coverage trend reporting in CI
* Mutation testing (e.g. Stryker) after baseline stability

End of testing main prompt.
 
## Mandatory Final Step
Before closing the Testing phase, perform and report these checks:
1. Parity: Every executable runtime file (`.ts`/`.vue`) has a colocated spec (excluding pure interfaces). List any missing before proceeding.
2. Assertion Quality: Each spec contains at least one behavior outcome, one accessibility check, and one edge/boundary case. Weak specs are strengthened (no tautological smoke-only tests remain).
3. Timers & Async: Carousel test uses `jest.useFakeTimers()` and restores timers; any async behaviors awaited properly.
4. Feature Flags: Tests cover at least one enabled and one disabled scenario for each documented flag.
5. Env Negative Paths: Missing required variable case throws; malformed flags parse gracefully without crashing.
6. Store Cycle: Cart store spec validates initial state, mutation/action round trip and subtotal logic (if implemented).
7. Coverage: Global line coverage ≥ {{coverage_target_lines}}%; report final percentage. Uncovered lines are either intentional dead code queued for removal or slated for a future test.
8. No Duplication: No duplicate spec filenames or trivial copies created to pad coverage.
9. Build & Lint Sanity: Optional quick run of `npm run lint` to ensure tests didn't mask type errors.
10. Test Execution: User has run `npm test` after agent displayed the command block and confirmed with "Tests complete"; suite exits code 0 without warnings or errors.
10. Prompt Alignment: Any improvements to patterns (e.g., repeated edge case templates) reflected back into this prompt before phase closure.

Produce a concise summary including: missing specs (if any), coverage %, files updated for reinforcement, and next deferred improvements. Mark phase complete only when all mandatory checks pass.
