# product-listing.prompt.md

## Purpose
Provide a full catalog view of all available `Product` items sourced from `mockProducts`. Serves as a destination when users click any primary navigation item in the header.

## Route
Registered at path `/product-listing` (see `router.prompt.md`).

## Functional Requirements
1. Page heading "All Products" (global `Header` supplied by layout).
2. Display every product using existing `ProductCard` component.
3. Use a responsive CSS grid: auto-fill columns min 220px.
4. Each product card includes Add to Cart button (emits `add-to-cart`).
5. Each product card is wrapped in a `router-link` navigating to `/product-details/{id}` for a dedicated product page.
6. View emits upward `add-to-cart` events with product id when a card button is clicked (optional parent handling).
7. No pagination or filtering in MVP.
 8. MUST render a non-empty list when `mockProducts.length > 0`; if route appears empty, verify router registration (see Troubleshooting section) and that `ProductListingView.vue` returns `{ products: mockProducts }` in `data()`.

## Data Source
- Import `mockProducts` from `src/mocks/data.mock.ts` (in examples referenced via alias path `@/mocks/data.mock`). Ensure the import path matches the configured alias (e.g. `@` → `src`).
- Do not mutate; treat as read-only array.

## Accessibility
- Wrap listing in `<section aria-labelledby="listing-heading">`.
- Heading `<h1 id="listing-heading">All Products</h1>`.
- Use semantic `<ul>` with `<li>` per product (avoid manual list roles).
- Card accessible name is the product name via `aria-label` on `<article>`.
- Ensure link wrapper around card preserves accessible name (avoid adding extraneous text).

## Styling Guidelines
Framed section pattern aligns with homepage sections:
1. Listing container: `max-width: var(--layout-container-wide); margin: 0 auto; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); padding: var(--space-6); display: flex; flex-direction: column;`.
2. Title centered; use `font-size: var(--font-size-xl)` and `margin-bottom: var(--space-6)`.
3. Grid: auto-fill columns min 220px; gap `var(--layout-grid-gap)` (mobile `var(--space-4)`).
4. Mobile horizontal padding reduced to `var(--layout-page-padding-mobile-x)` while keeping vertical rhythm.
5. Avoid raw pixel values—extend tokens if new sizing variants emerge.
6. Link wrapper `.listing__link` remains block display, inherits color, removes underline.

## Emitted Events
| Name | Payload | When |
|------|---------|------|
| `add-to-cart` | `product.id` | When any ProductCard emits add-to-cart |

## Edge Cases
- Empty product array (not expected in workshop); would render empty grid.
- Large product names wrap; no truncation.
- Missing optional `originalPrice` simply omits strike-through pricing.
 - Misconfigured route (e.g., missing `/product-listing` child entry) leads to blank view or layout-only render.

## Testing (ProductListingView.spec.ts)
1. Renders count of `.product-card` equal to `mockProducts.length`.
2. (Optional) Simulate Add button on first card and assert emitted `add-to-cart` at view level.
 3. Visiting `/product-listing` directly (router push) yields non-zero product card count.

## Non-Goals
- Sorting, filtering, search integration, infinite scroll.
- Server-side fetching.

## Troubleshooting Empty Product Listing Route
If navigating to `/product-listing` shows an empty layout:
1. Confirm route registration in `router.prompt.md` includes child path `product-listing` with name `product-listing` mapped to `ProductListingView.vue`.
2. Verify the component's `data()` returns `{ products: mockProducts }` and not a differently named property.
3. Ensure the import statement matches the alias: `import { mockProducts } from '@/mocks/data.mock';`.
4. Check that `ProductCard` prop bindings use correct casing (`:imageUrl`, `:originalPrice`)—mismatched kebab-case can break rendering if runtime conversion fails.
5. Confirm feature flags are NOT gating this view (listing view should not depend on any flag).
6. Run a console log inside `data()` to ensure `mockProducts.length > 0`; if zero, inspect mock data source path or alias resolution.

If all above pass, inspect router navigation (e.g., programmatic push) for typos: must push to `'/product-listing'` (leading slash required).

See `product-listing.example.md` for implementation snapshot.

## Generation Parity Requirement
`src/views/ProductListingView.vue` MUST match `product-listing.example.md` exactly. Steps:
1. Open example file prior to generation.
2. Copy template/script/style blocks verbatim (preserve list semantics, router-link wrapping, framed container styles).
3. Do not alter grid min column width, event names, or prop casing.
4. Update example first for any changes; regenerate implementation afterward to enforce parity.
