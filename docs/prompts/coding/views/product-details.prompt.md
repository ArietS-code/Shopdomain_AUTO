# product-details.prompt.md

## Purpose
Dedicated view presenting full details for a single `Product` selected from catalog or homepage deals. Provides image, pricing (including discount), rating, badges, and an Add to Cart action.

## Route
- Path: `/product-details/:id`
- Name: `product-details`

## Functional Requirements
1. Resolve `id` from route params using `useRoute()`.
2. Lookup product from `mockProducts` by matching `product.id`.
3. If found, render details section; if not found render graceful Not Found message with link back to `/product-listing`.
4. Display product image (square), name (as page `<h1>`), pricing via existing `PriceTag` component, rating (if present), and badge list (if any).
5. Provide Add to Cart button emitting `add-to-cart` with product id AND dispatching `cart/addToCart` to Vuex with minimal payload.
6. Implement defensive check: if product not found, button logic skipped and Not Found section rendered.
7. Do not mutate product object; treat as read-only.

## Accessibility
- Root wrapper `<div class="product-details" aria-label="Product Details">`.
- Heading `<h1 id="details-heading">` labeled by `aria-labelledby` on surrounding `<section>`.
- Badge list `<ul aria-label="Badges">` only when badges exist.
- Not Found state communicates failure clearly with heading and recovery link.

## Data Source
- Import `mockProducts` from `src/mocks/data.mock.ts`.
- Type product as `Product | undefined` after lookup.

## Styling Guidelines
Framed container approach mirrors other views:
1. Root `.product-details`: `max-width: var(--layout-container-max); margin: 0 auto; padding: var(--space-6); border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--layout-section-gap-y);`.
2. Grid two-column layout desktop: fixed media column (~420px) + flexible info column; gap `var(--layout-grid-gap)`; collapse to single column under 640px and reduce padding to `var(--space-5) var(--layout-page-padding-mobile-x)`.
3. Media wrapper: bordered alt background (`var(--color-bg-alt)`), border-radius `var(--radius-md)`, border `1px solid var(--color-border)`; image maintains ratio token `aspect-ratio: var(--product-card-image-ratio) / 1`.
4. Badges & button leverage existing color + radius tokens; avoid raw hex duplication—extend tokens if variants needed.
5. Not Found state uses same framed pattern (border/background/radius) for visual consistency.

## Edge Cases
- Invalid id → render Not Found state (no console errors).
- Product missing optional fields (`rating`, `badges`, `originalPrice`) gracefully omit those UI pieces.
- Very long product names wrap naturally.

## Troubleshooting Missing Add to Cart Button
If the Add to Cart action is absent:
1. Confirm the template includes a `<button class="details__add" type="button" @click="onAdd" aria-label="Add to Cart">Add to Cart</button>` element.
2. Verify `onAdd()` emits `add-to-cart` THEN dispatches `cart/addToCart` with required payload (`id`, `name`, `price`, `imageUrl`, `currency`).
3. Ensure the component registers Vuex store access (`this.$store` or `useStore()`) and that the `cart` module with `addToCart` action exists.
4. Check that product lookup succeeded; if `product` is `undefined` the button will not render—add a console log or devtool inspection.
5. Confirm import path for mock data matches alias: `import { mockProducts } from '@/mocks/data.mock';`; wrong path results in empty product and missing button.
6. Make sure styles are not hiding the button (e.g. accidental `display:none` or parent overflow clipping). Button should use brand colors for visibility.
7. If migrating to Composition API, ensure `emit` is defined and used; missing emit prevents the parent from listening and may lead to assumptions that button is absent.

## Emitted Events
| Name | Payload | When |
|------|---------|------|
| `add-to-cart` | `product.id` | User clicks Add to Cart button |

## Testing (ProductDetailsView.spec.ts)
1. With valid id, renders name and pricing.
2. With invalid id, shows Not Found heading.
3. Badge list appears only when product has badges.
4. Add to Cart dispatch increments cart subtotal (mock store or spy on dispatch).

## Non-Goals
- Fetching remote data, related products carousel, inventory status, quantity selector.

Refer to `product-details.example.md` for implementation snapshot.

## Generation Parity Requirement
`src/views/ProductDetailsView.vue` MUST replicate `product-details.example.md` verbatim. Steps:
1. Read example file before generating.
2. Copy template/script/style blocks exactly (preserve button, badges, media layout, framed container).
3. Do not introduce new computed properties or alter grid dimensions.
4. Example must be updated first for any future change; regenerate after to maintain parity.
