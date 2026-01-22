# homepage.prompt.md

## Purpose
Primary landing view composing global chrome (`Header` + `Footer`) with ALWAYS-ON marketing and merchandising zones (Carousel, Promotions, Deals, Categories). Former feature flag gating for these sections has been removed; all users see full experience.

## Structure (Top → Bottom)
Layout provides global chrome (Header + Footer). Inside the view (all mandatory):
1. `Carousel` (hero slides) – always rendered (if `slides` array empty, render placeholder state or omit internally without flag gating).
2. Promotions wrapper – flex row of `PromotionBanner` tiles (each uses background image via `imageUrl` + overlay). Always rendered; if `promotions` empty show skeleton or gracefully empty container (future enhancement).
3. Deals section – filtered discounted products (see Discount Logic). Always rendered; centered grid alignment (`justify-items: center`) ensures uniform presentation. If no discounted products, section displays an unobtrusive “No current deals” message (future enhancement) rather than being removed.
4. Categories section – always rendered (empty array results in empty grid) for consistent navigation anchor; centered layout and grid.
5. Deal products wrapped in `router-link` to `/product-details/{id}` for navigation.

## Data Inputs
- `products: Product[]`
- `categories: Category[]`
- `promotions: Promotion[]`
- `slides: CarouselSlide[]`

## Feature Flags (Deprecated)
Previous flags `showPromotions`, `showCarousel`, `showDeals` are DEPRECATED and MUST NOT be used for conditional rendering. Remove any `v-if` conditions relying on these flags. The homepage delivers a consistent full-experience baseline. If future limited experiences are required, introduce new flags with explicit deprecation plan—but avoid reintroducing gating for core sections.

## Discount Logic
Derived deals list filters `products` where `originalPrice > price`. All such products are rendered (no hard cap yet). Future enhancement: cap to N (e.g. 6) and expose a "See all" link.

## Component Registration
Registered locally: `Carousel`, `PromotionBanner`, `ProductCard`, `CategoryGrid`. (Header/Footer supplied by layout.)

## Removed / Not Implemented
- Standalone `SearchBar` previously placed below `Header`; now removed in favor of integrated header search.
- Seasonal strip & recommendations not yet implemented (keep scope focused).

## Behavior & Fallbacks
- Promotions: if `promotions` empty, show framed container (optionally leave blank or render placeholder copy “No promotions currently”).
- Carousel: if `slides` empty, either render a minimal placeholder slide or skip internal slide markup while keeping the section container for layout consistency.
- Deals: if no discounted products, still render section frame; optionally show a subtle message (future). Do NOT remove section to avoid layout jump.
- Categories: always renders heading + grid (grid empty when no categories) for structural stability.
- Product cards in deals clickable via `.deal-link` router wrappers.

## Accessibility
- Section containers use `aria-label` to describe semantic purpose ("Deals", "Categories", "Promotions").
- Heading hierarchy keeps page scan consistent (`h2` for major subsections under page context).
- Future: Add skip link and landmark roles (e.g., `main`).

## Performance Considerations
- Images in product cards should use `loading="lazy"` (verify in `ProductCard.vue`).
- Keep computed filtering (`productsWithDeals`) minimal and pure.
- Consider memoizing deals list if product collection grows large.
- Promotion background images are CSS backgrounds (no `<img>` tags). For large image sets consider lazy-loading via IntersectionObserver (future enhancement) to avoid early network contention.

## Testing Guidance (`HomepageView.spec.ts`)
Write tests covering:
1. All four core sections render (Carousel, Promotions, Deals, Categories) even with empty data arrays (except optional placeholder assertions).
2. Deals logic only includes discounted products in rendered product cards.
3. Promotions section renders correct count of banners (`promotions.length`).
4. Carousel displays correct active slide and dot count (`slides.length`).
5. Categories section renders heading and category cards length.

## Edge Cases
- No discounted products → deals section still present (cards list empty; future message optional).
- Empty promotions array → section frame present (optional placeholder); ensures stable vertical rhythm.
- Empty slides array → placeholder or empty carousel container; dot nav omitted gracefully.
- Large product list → verify grid performance & DOM size (future virtualization if needed).

Refer to updated `homepage.example.md` for structural alignment with current implementation.

## Styling Guidelines
Unified framing pattern introduced for major homepage sections (Promotions, Deals, Categories) via `.section-frame` utility:
1. `.section-frame` styles: `max-width: var(--layout-container-max); margin: 0 auto; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6); align-items: center;`
2. Root wrapper retains `padding: var(--layout-page-padding-y) var(--layout-page-padding-x)` and vertical flex `gap: var(--layout-section-gap-y)` (mobile horizontal padding shifts to `var(--layout-page-padding-mobile-x)`).
3. Deals product grid and Categories item grid keep unified `gap: var(--layout-grid-gap)` and inherit section-frame horizontal centering; both apply `justify-items: center` for consistent centering across varied item widths.
4. Promotions section uses responsive flex wrap (`gap: var(--space-4)`) with each `PromotionBanner` flexing (`flex: 1 1 300px`) while remaining inside framed container; banner content is center-aligned (`text-align: center`).
5. Remove any hardcoded widths/gaps if new layout variants are needed—introduce tokens first (e.g., additional container width token).

## Routing Context
Homepage is registered at path `/` (see `router.prompt.md`). Primary navigation links in `Header` currently route users to `/product-listing` (catalog). Deal product clicks route to `/product-details/:id`.

## Generation Parity Requirement
`src/views/HomepageView.vue` MUST match `homepage.example.md` exactly. Steps:
1. Read example file (including `.section-frame` usage and always-on sections) before generation.
2. Copy template/script/style verbatim—remove all legacy flag gating code if still present elsewhere.
3. Preserve ordering of sections: Carousel, Promotions, Deals, Categories.
4. For any future adjustments, update the example first, then regenerate implementation to maintain strict parity.
