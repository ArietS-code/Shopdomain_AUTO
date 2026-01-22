# feature-flags.prompt.md

## Purpose
Standardize definition, parsing, typing, usage, and testing of build-time and runtime feature flags. IMPORTANT: Core homepage sections (Carousel, Promotions, Deals, Categories) are now ALWAYS ON. Former gating flags `showPromotions`, `showCarousel`, `showDeals` are deprecated and must be removed from rendering logic.

## Flag Source
Flags originate from `VITE_FEATURE_FLAGS` and are exposed via `EnvConsts.FEATURE_FLAGS_LIST` using merged precedence: `process.env` → `import.meta.env` → shim (`globalThis.__VITE_ENV__`). Post-deprecation examples exclude homepage section flags (e.g., `"betaSearch,newBadge"`).

## Parsing Contract
Create a utility `src/flags/featureFlags.ts` exporting:
```ts
export interface FeatureFlags {
  betaSearch?: boolean; // experimental search UI
  newBadge?: boolean;   // toggle new badge styling
  // DEPRECATED (removed): showPromotions, showCarousel, showDeals
}

const DEFAULT_FLAGS: Required<Pick<FeatureFlags,'betaSearch'|'newBadge'>> = {
  betaSearch: false,
  newBadge: false
};

export function parseFeatureFlags(raw: string | undefined): FeatureFlags { /* implementation */ }

export function isEnabled(flags: FeatureFlags, name: keyof FeatureFlags): boolean { return !!flags[name]; }
```

### Parsing Rules
1. If `raw` is undefined/empty -> return `DEFAULT_FLAGS`.
2. Split by comma, trim tokens; ignore blanks.
3. For each key in `DEFAULT_FLAGS`, set to `true` if present; else keep default.
4. Unknown tokens ignored silently.
5. Any deprecated homepage flags encountered (for backwards compatibility) are ignored and logged with `console.warn('[flags] Deprecated flag ignored: ' + token)`.

## Usage Pattern
- Import singleton `currentFlags = parseFeatureFlags(EnvConsts.FEATURE_FLAGS)` early.
- Pass only experiment flags to components that need them.
- Do NOT gate core homepage sections; remove legacy `v-if` checks for `showPromotions`, `showCarousel`, `showDeals`.

## Extension Guidelines
When adding a new experimental flag:
1. Append to `FeatureFlags` & `DEFAULT_FLAGS` (default false unless critical improvement).
2. Document purpose + sunset criteria in code comment.
3. Update tests and prompts referencing the flag.
4. Avoid coupling or complex multi-flag expressions.
5. Never hide baseline navigation or primary merchandising sections.

## Removal Guidelines
- Mark experimental flag as deprecated (comment) → observe for one cycle → remove code/tests/prompt references.
- For core experience changes prefer progressive enhancement instead of gating removal.

## Testing Strategy
`featureFlags.spec.ts` should cover:
1. Empty/undefined raw -> defaults.
2. Single known experimental flag sets true.
3. Multiple flags set true.
4. Unknown token ignored.
5. Deprecated homepage flags produce warning & remain absent.
6. `isEnabled` returns correct boolean.

## Anti-Patterns
- Direct widespread `import.meta.env` reads (centralize parse).
- Using flags to remove essential content (homepage merchandising).
- Complex chained expressions for experiments.
- Persisting flag overrides ad hoc (future enhancement only).

## Example Raw Values (post-deprecation)
- Single experiment: `"betaSearch"`
- Multiple experiments: `"betaSearch,newBadge"`
- None: `""` or undefined.

## A11y Considerations
Flags must NEVER hide critical navigation or primary homepage sections. Experiments may augment/modify but not remove baseline accessible content.

## Performance Notes
Parsing remains O(n); negligible. Avoid re-parsing per component.

## Next Steps
Purge legacy section gating checks from code/examples; update tests to assert presence of all homepage sections independent of flags.
