# product-card.prompt.md

## Purpose
Render a product summary tile: image, name, formatted price (with optional originalPrice discount), and an Add to Cart button.

## Props
Discrete props (flattened for simplicity in MVP):
| Name | Type | Required | Notes |
|------|------|----------|-------|
| id | `string` | yes | Product identifier emitted on add-to-cart |
| name | `string` | yes | Display name & alt text basis |
| imageUrl | `string` | yes | Source for product image |
| price | `number` | yes | Current sale/regular price |
| originalPrice | `number` | no | If present and > price, show struck-through original |
| currency | `string` | yes | Currency symbol passed to `PriceTag` |

## Events
| Name | Payload | Description |
|------|---------|-------------|
| add-to-cart | `id` | Emitted when Add to Cart button clicked |

## Behavior
* Use `PriceTag` to display pricing (do not duplicate formatting logic).
* Display originalPrice only via `PriceTag` when provided.
* Emit `add-to-cart` with `id` AND dispatch `cart/addToCart` to Vuex store with minimal product payload.
* Button click uses `@click.stop.prevent` when card is wrapped by a `<router-link>` to avoid unintended navigation to product details.

## Accessibility
* Wrapper `<article>`; `img` alt equals product name.
* Button text: "Add to Cart" (keep static; accessible name derives from surrounding context and article label).

## Styling
* Vertical column layout; consistent spacing tokens.
* Enforce consistent card size with a fixed aspect-ratio image wrapper (`aspect-ratio: 1/1`) and line clamp (2 lines) on name for uniform height.
* Button full-width inside card; brand deep background, medium hover.
* Consider custom focus style if design tokens expand (future).

## Edge Cases
* Missing optional `originalPrice` simply means no discount display.
* Long product name wraps naturally (no truncation yet).

## Troubleshooting Missing Add to Cart Button
If the button is not visible in implementations:
1. Verify the markup includes a `<button class="product-card__add" type="button">Add to Cart</button>` element (class name may vary; ensure consistent naming with example).
2. Confirm the component emits `add-to-cart` on click: `this.$emit('add-to-cart', this.id)` (Options API) or `emit('add-to-cart', props.id)` (script setup).
3. Ensure Vuex dispatch occurs after emission (order: emit → dispatch) and that the store namespace `cart/addToCart` exists.
4. If wrapped in a `<router-link>`, include `@click.stop.prevent` on the button to prevent navigation swallowing the click.
5. Check that the `currency` prop is passed; missing currency may cause `PriceTag` failure that aborts render of lower DOM (inspect console errors).
6. Confirm global token injection so button styles using `var(--color-brand-deep)` resolve; missing tokens can result in invisible text on similar background.
7. Use browser devtools to ensure the button isn't hidden by flex overflow or line clamp rules—avoid setting `overflow: hidden` on the root card wrapper for now.

## Testing (ProductCard.spec.ts)
1. Renders product name.
2. Emits `add-to-cart` with id and triggers store dispatch (mock store or spy on `dispatch`).
3. Displays both price and originalPrice text when originalPrice provided.
4. Does not error when originalPrice absent.
5. Click does not navigate when nested inside a router-link (assert current route unchanged).

Refer to `product-card.example.md` (updated) for baseline skeleton.

## Generation Parity Requirement
`src/components/ProductCard.vue` MUST replicate `product-card.example.md` exactly. Steps:
1. Read the example file before generation.
2. Copy all blocks preserving prop names (`imageUrl`, `originalPrice`), event name (`add-to-cart`), and class names.
3. Do not introduce Composition API, additional emits, or style alterations.
4. Future changes require modifying the example first; implementation must then be regenerated to keep parity.
