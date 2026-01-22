# env-consts.prompt.md

## Purpose
Centralize environment variable access with a resilient strategy that works in Vite runtime and Jest tests, avoiding direct `import.meta.env` usage in most code and preventing hard crashes when variables are absent.

## Implementation Location & Generation
Primary file: `src/shared/EnvConsts.ts` (generated/updated when this prompt runs).
Optional spec (future): `src/shared/EnvConsts.spec.ts` verifying warnings on missing required vars and flag parsing.

## Strategy
1. Attempt to read `import.meta.env` (wrapped in try/catch for non-browser/test contexts).
2. Merge with shim `globalThis.__VITE_ENV__` (assigned early in `main.ts`).
3. Merge with `process.env` while preferring Vite-provided values.
4. Provide exported constants with sane defaults.
5. Warn (not throw) if expected variables are missing.
6. Parse `VITE_FEATURE_FLAGS` into raw string and normalized list, IGNORING deprecated homepage section flags (`showPromotions`, `showCarousel`, `showDeals`) if present and logging a warning.

## Exports
| Name | Default | Notes |
|------|---------|-------|
| `APP_NAME` | `'ai-in-action-workshop-level2-ui'` | Application branding fallback |
| `API_BASE_URL` | `'http://localhost:3000/api'` | Local dev API placeholder |
| `FEATURE_FLAGS` | `''` | Raw comma-separated flags string (experimental only) |
| `FEATURE_FLAGS_LIST` | `string[]` | Parsed + trimmed non-empty entries excluding deprecated homepage flags |

## Fallback Behavior
- Missing required vars produce `console.warn` messages with prefix `[env]` instead of throwing errors (previous strict assertions replaced to stabilize UX).
- Feature flags remain optional.

## Usage Guidelines
- Import constants rather than accessing `import.meta.env` directly.
- Never mutate exported constants.
- Use `FEATURE_FLAGS_LIST` only for experimental features; do NOT gate homepage core sections.
- Assign the shim in `main.ts` before other imports to ensure early availability.

## Testing Guidance
- In Jest setup, assign `process.env.VITE_APP_NAME` if needed.
- Verify missing variables only warn.
- Test feature flag parsing with `process.env.VITE_FEATURE_FLAGS='betaSearch,newBadge,showDeals'` and assert list equals `['betaSearch','newBadge']` (deprecated `showDeals` ignored with warning).

## Future Enhancements
- Type-safe experimental flag parser.
- Validation report listing ignored deprecated flags.
- Optional runtime overlay for env diagnostics.
