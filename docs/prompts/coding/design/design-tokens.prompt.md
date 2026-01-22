# design-tokens.prompt.md

## Purpose
Centralize design primitives (color, spacing, typography, radii, shadow, breakpoint, z-index) for consistent styling and easier theming.
STRICT PARITY: The generated `src/theme/tokens.scss` MUST be byte-for-byte identical to `design-tokens.example.md` (including comments, ordering, naming, hex values, and CSS custom property mapping) with no additions, removals, renames, or reordering. If a future change is required, FIRST update `design-tokens.example.md` in the same commit and document the justification; never allow silent drift. All components, views, and layout must consume tokens ONLY via CSS variables (e.g. `var(--space-4)`)—no hardcoded hex codes or ad-hoc spacing numbers.

## Categories
| Group | Implemented Tokens | Notes |
|-------|--------------------|-------|
| Color (brand + semantic) | Base: `--color-primary`, `--color-primary-accent`, surfaces: `--color-bg`, `--color-surface`, section: `--color-bg-section`, alt: `--color-bg-alt`, text: `--color-text`, `--color-text-muted`, inverse: `--color-text-inverse`, border: `--color-border`; Brand scale: `--color-brand-deep`, `--color-brand-medium`, `--color-brand-accent`, `--color-brand-warm`; Aliases: `--color-brand-primary`, `--color-brand-secondary`, `--color-brand-highlight` | Added aliases & section backgrounds to align with component examples and prevent compile errors. |
| Spacing | `--space-1..8` (1,2,3,4,5,6,8) | 4pt grid, skip 7 to keep minimal set. |
| Typography | `--font-size-xs`, `--font-size-sm`, `--font-size-md`, `--font-size-lg`, `--font-size-xl`, `--font-family-base`, letter-spacing: `--letter-tight`, `--letter-normal`, `--letter-wide` | Future: line-height scale. |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`, search composite `--search-radius` | Pill shape now supported for badges/search input. |
| Elevation (Shadow) | `--elevation-1`, `--elevation-2` | Higher elevations reserved for modals/tooltips. |
| Layout Heights | `--header-height-primary`, `--header-height-secondary` | Used by sticky header logic (future). |
| Layout Structure & Spacing | Containers: `--layout-container-max`, `--layout-container-wide`; Page paddings: `--layout-page-padding-x`, `--layout-page-padding-y`, mobile: `--layout-page-padding-mobile-x`; Section rhythm: `--layout-section-gap-y`; Grid gap: `--layout-grid-gap`; Component dims: `--carousel-min-height` (now 560px), `--product-card-image-ratio` | Consolidates previously hardcoded widths (1080px/1100px/1280px) & gaps (16px/24px) to unify vertical rhythm & grid consistency. |
| Feature Flags (env) | Not tokens; documented separately | Kept in `EnvConsts`. |
| Future | Breakpoints, z-index scale, dark theme override | Planned additions. |

## Implementation
- SCSS variables defined in `src/theme/tokens.scss` then emitted as CSS custom properties within a single `:root` block.
- Include file via global Sass prep (Vite `additionalData`) to avoid per-component imports.
- Derived tokens (elevations, letter-spacing, header heights) declared above custom property list, then mapped to variables.
 - Do NOT manually import `tokens.scss` inside `LayoutDefault.vue`, `main.ts`, or any component; global injection handles availability.
 - Newly added aliases (`brand-primary`, `brand-secondary`, `brand-highlight`, `color-bg-section`, etc.) resolve previously missing SCSS references found in component/style examples. They map directly to existing base tokens—avoid duplicating divergent hex values.

## Usage Conventions
- Color: reference CSS variables (`var(--color-brand-deep)`) instead of hex.
 - Prefer semantic aliases (e.g. `--color-bg-section`) in components for clarity; underlying values sourced from base palette.
- Spacing: pick nearest scale step; if missing, propose new token (avoid one-off values).
- Layout: replace hardcoded `padding`, `gap`, and `max-width` pixel values in examples with new layout tokens. Use `--layout-container-max` for most centered blocks (homepage sections, product details, deals & categories grids) and `--layout-container-wide` for expansive catalog listings. Apply `--layout-page-padding-x` / `--layout-page-padding-y` at root view wrappers (mobile substitutes `--layout-page-padding-mobile-x`). Maintain vertical rhythm between major sections with `--layout-section-gap-y` and normalize product/category grid spacing with `--layout-grid-gap`. Carousel must use `--carousel-min-height` instead of a numeric value; product card media uses `aspect-ratio: var(--product-card-image-ratio) / 1`.
- Typography: use size tokens; letter spacing only when design calls for subtle emphasis.
- Shadows: limit use to elevation tokens; do not craft ad hoc box-shadows.
- Header heights: drive layout calculations (sticky offsets) rather than magic numbers.
- Search radius: unify rounded search input styling.

## Extension Guidelines
1. Append tokens; never repurpose existing names.
2. Annotate new tokens with semantic comment (why it exists).
3. Validate contrast (WCAG AA) for interactive foreground/background combos.
4. For new brand shades maintain consistent lightness increments (~15–20%).
5. Introduce breakpoints & z-index as discrete tokens before consumption.
6. When migrating examples, ensure removal of legacy hardcoded layout values (e.g., `max-width: 1100px;`, `padding: var(--space-8) var(--space-6);`) in favor of the new container & page padding tokens while preserving visual intent.

## Theming Strategy (Future)
- Introduce `[data-theme="dark"]` override block using same token names.
- Keep neutral names (avoid product-specific naming) to allow portability.

## Testing
- No direct unit tests; verified via visual regression and lint rules discouraging hardcoded values.
 - (Optional script) Add a parity check script `scripts/verify-tokens.mjs` that reads `src/theme/tokens.scss` and `docs/prompts/coding/design/design-tokens.example.md` to assert exact match; failing builds block drift.
 - (Optional style audit) Grep for disallowed legacy names (`$color-brand-primary`, `$color-brand-highlight` without variable) to ensure only tokens are used.

Refer to updated `design-tokens.example.md` and `tokens.scss.example.md` for concrete token list (brand palette: deep #e0004d, medium #ff2e6d, accent #ff6999, warm #ffc2d5; layout containers 1120px/1280px; carousel min-height 560px (progressive increases: 300px → 320px → 420px → 560px for larger hero presence); unified grid gap token; page paddings & section rhythm tokens).
MANDATORY GENERATION RESULT: Produce ONE file only (`src/theme/tokens.scss`). No alternate or duplicate token files (e.g., `tokens-alt.scss`, `palette.scss`).
