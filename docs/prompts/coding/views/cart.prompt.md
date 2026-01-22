# cart.prompt.md

## Purpose
Provide a minimal functional shopping cart view where users can review items, see subtotal, continue shopping, and checkout (success confirmation modal).

## Route
- Path: `/cart`
- Name: `cart`
- Registered as child route under layout parent (see `router.prompt.md`).

## Data Source & State
- Uses Vuex cart module (`cart` namespace) with items containing: id, name, price, quantity, imageUrl, currency.
- Subtotal derived from getter `cartSubtotal` summing `price * quantity`.

## Functional Requirements
1. Display heading: `Your Cart`.
2. List all items with image, name, line total (price * quantity) and quantity badge when >1.
3. Provide + (increment) and - (decrement/remove) controls per item.
4. Show subtotal section with amount formatted using `$` symbol and 2 decimals.
5. "Continue Shopping" navigates to `/product-listing`.
6. "Checkout" triggers success modal (order placed) and clears cart.
7. Empty cart displays friendly message instead of list.

## Accessibility
- Root wrapper: `<div class="cart-view" aria-label="Cart">`.
- Items list: `<ul aria-label="Cart items">`.
- Success modal uses `<div role="dialog" aria-modal="true" aria-label="Checkout Success">` (future improvement: native `<dialog>` tag).
- Buttons have descriptive `aria-label` attributes.

## Styling Guidelines
Adopt unified framed container pattern:
1. Root `.cart-view`: centered `max-width: var(--layout-container-max)` with `margin: 0 auto; padding: var(--space-6); border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-6);`.
2. Two-column layout: `.cart-layout` flex row with gap `var(--layout-grid-gap)`; collapses to column under ~800px, summary moves above items.
3. Summary panel: bordered card (`border: 1px solid var(--color-border); background: var(--color-bg-alt); border-radius: var(--radius-md); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4);`).
4. Item cards: grid of flex rows each with border/background tokens—replace raw pixel spacing with `var(--space-4)` and radii tokens.
5. Buttons & quantity controls rely on brand + radius tokens; no hardcoded hex duplicates beyond design tokens.
6. Modal content: framed with border & radius tokens (`var(--radius-lg)`) maintaining visual consistency across views.

## Vuex Integration
- Add item: `dispatch('cart/addToCart', product)` increments quantity if item exists.
- Clear cart: `dispatch('cart/clearCart')` invoked on successful checkout.

## Edge Cases
- Empty cart → disabled checkout button.
- Rapid increment/decrement should keep subtotal accurate (no async delays).
- Items removed when quantity drops to 0.

## Testing Guidance (`CartView.spec.ts`)
1. Pre-seed store and assert item + subtotal rendered.
2. Trigger checkout and assert success modal appears.
3. (Optional) Increment/decrement affects subtotal.

## Non-Goals
- Promo code entry, tax calculation, shipping estimation, persistent storage.

Refer to `cart.example.md` for implementation snapshot.

## Generation Parity Requirement
`src/views/CartView.vue` MUST copy `cart.example.md` verbatim. Steps:
1. Read example file pre-generation.
2. Replicate template/script/style blocks exactly (preserve modal markup, class names, token usage).
3. Do not alter quantity logic or dispatch sequence.
4. Modify example first for any changes; regenerate afterward to maintain parity.
