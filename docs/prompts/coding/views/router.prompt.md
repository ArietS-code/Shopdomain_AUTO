# router.prompt.md

## Purpose
Document application routing additions beyond the initial home view. Introduces product listing route consumed by header navigation.

## Routes
Using a layout parent route that provides global chrome (Header/Footer):
| Path | Name | Component |
|------|------|-----------|
| `/` | (parent) | `LayoutDefault.vue` |
| `` (child) | `home` | `HomepageView.vue` |
| `product-listing` (child) | `product-listing` | `ProductListingView.vue` |
| `product-details/:id` (child) | `product-details` | `ProductDetailsView.vue` |
| `cart` (child) | `cart` | `CartView.vue` |

Example router configuration (ensure product listing route renders properly):
```ts
import { createRouter, createWebHistory } from 'vue-router';
import LayoutDefault from '@/layout/LayoutDefault.vue';
import HomepageView from '@/views/HomepageView.vue';
import ProductListingView from '@/views/ProductListingView.vue';
import ProductDetailsView from '@/views/ProductDetailsView.vue';
import CartView from '@/views/CartView.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: LayoutDefault,
			children: [
				{ path: '', name: 'home', component: HomepageView },
				{ path: 'product-listing', name: 'product-listing', component: ProductListingView },
				{ path: 'product-details/:id', name: 'product-details', component: ProductDetailsView },
				{ path: 'cart', name: 'cart', component: CartView }
			]
		}
	]
});

export default router;
```

## Conventions
- Use history mode via `createWebHistory()` (no hash routes).
- Parent layout wraps children via `children` array; child empty path maps to home.
- Keep route names kebab-case aligned with file names.
- Components imported directly (no lazy loading in MVP for simplicity).
- Layout specification lives in `../layout/layout.prompt.md`; router must not import Header/Footer directly—only the layout component.

## Header Integration
- Primary nav items route users to `/product-listing` using `<router-link>`.
- Cart button (in actions) uses `<router-link to="/cart">` and displays dynamic subtotal via store getter.
- Future enhancement: map each nav item to distinct category or feature route.

## Testing Guidance
- Header.spec.ts asserts navigation updates `router.currentRoute.value.path` to `/product-listing` after click.
- ProductListingView.spec.ts ensures grid renders all products (implicit route viability).
- Router.spec.ts can perform direct navigation: `router.push('/product-listing')` then `await router.isReady()` and assert product cards > 0 to guard against empty route regressions.

## Future Considerations
- Lazy-load heavy views (listing, details, cart) as catalog grows.
- Add 404 fallback route.
- Implement category filtering via query params (e.g., `/product-listing?cat=dairy`).
- Guard checkout route (if created) behind auth later.
 - Consider route-level prefetch of mock data if moving to remote source to avoid flash of empty content.

## Generation Parity Requirement
`src/router/index.ts` MUST reflect this prompt's route table exactly. Steps:
1. Use the example configuration block above verbatim (paths, names, ordering).
2. Do not add lazy-loading, guards, or extra routes unless the prompt & (future) example are updated first.
3. If modifications are needed, update this prompt (and create an example file if introduced) before regenerating.
