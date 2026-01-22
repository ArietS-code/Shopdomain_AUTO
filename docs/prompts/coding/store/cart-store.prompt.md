# cart-store.prompt.md

## Purpose
Provide client-side cart state management (add, decrement/remove, clear, subtotal) using Vuex 4.

## Module Path
`src/store/cart.ts` (namespaced: `cart`). Imported and registered in `src/store/index.ts`.

## State Shape
```ts
interface CartItem { id: string; name: string; price: number; quantity: number; imageUrl: string; currency: string; }
interface CartState { items: CartItem[] }
```

## Mutations
| Name | Payload | Behavior |
|------|---------|----------|
| `ADD_ITEM` | `Product` | If item exists, increment quantity; else push new item with quantity=1. Fallback currency `$` if missing. Warn if payload invalid. |
| `DECREMENT_ITEM` | `id: string` | Decrement quantity; remove item if quantity <=0. |
| `REMOVE_ITEM` | `id: string` | Remove item regardless of quantity. |
| `CLEAR` | `void` | Empty cart.

## Actions
Thin wrappers mapping to mutations: `addToCart`, `decrementItem`, `removeItem`, `clearCart`.

## Getters
| Name | Returns | Description |
|------|---------|-------------|
| `cartItems` | `CartItem[]` | Raw items array |
| `cartCount` | `number` | Total quantity across items |
| `cartSubtotal` | `number` | Sum of `price * quantity` |

## Integration
- Root store (`src/store/index.ts`) registers `{ cart }`.
- `main.ts` mounts store via `createApp(App).use(store).use(router) ...`.
- Components (`ProductCard.vue`, `ProductDetailsView.vue`, `Header.vue`, `CartView.vue`) access getters via `this.$store.getters['cart/...']`.

## Edge Cases
- Invalid product payload → log warning and ignore.
- Decrement removing item at zero keeps state clean.
- Currency missing → fallback `$`.

## Testing Guidance
1. Unit test ADD_ITEM increments quantity for duplicate add.  
2. DECREMENT_ITEM removes when quantity hits zero.  
3. cartSubtotal updates correctly after adds/decrements.  
4. CLEAR empties items.

## Non-Goals
Inventory reservation, persistence, promo code logic, tax/shipping calc.
