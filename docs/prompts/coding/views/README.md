# Views Prompts & Examples

| View | Prompt | Example |
|------|--------|---------|
| Home (ecommerce) | homepage.prompt.md | homepage.example.md |
| Product Listing (catalog) | product-listing.prompt.md | product-listing.example.md |
| Product Details | (tbd) | (tbd) |

## Conventions
- Views compose reusable components from `../components`.
- Options API only; no Composition API.
- Each view will have a colocated spec file when generated.
- Use semantic landmarks and list markup (`<ul><li>`) for collections.
- Header/Footer are NOT imported in individual views; they are provided globally via `layout/layout.prompt.md` (`LayoutDefault.vue`).

## Routing
See `router.prompt.md` for documented multi-route setup. Current routes:
- `/` → `HomepageView.vue`
- `/product-listing` → `ProductListingView.vue`
- `/product-details/:id` → `ProductDetailsView.vue`
All header navigation items presently link to the product listing route (MVP simplification).
 Parent route wraps these via `LayoutDefault.vue`.

## Next Steps
Homepage implemented as canonical landing page. Product listing view provides full catalog browsing. Product details view presents individual product information with image, pricing, rating, badges and add-to-cart action.
Future enhancements may introduce category-specific routes, lazy-loaded views, or filtering query params.
