# data-models.prompt.md

## Agent Instructions

Agent must follow all the steps exactly as described below. Must run the Mandatory Final Step at the end.
STRICT PARITY: This prompt produces exactly two source-of-truth files – `src/interfaces/domain.ts` and `src/mocks/data.mock.ts`. Their contents MUST be byte-for-byte identical to the examples `data-models.example.md` and `data-mock.example.md` in this directory (except for deliberate future extensions which MUST first update the example files in the same commit). Do NOT reorder fields, rename exports, change IDs, or alter mock ordering. Any intentional divergence requires: (1) explicit justification in output summary, (2) simultaneous update of the corresponding `*.example.md` file so there is never silent drift. Multiple or alternate mock/interface files are forbidden.

## Purpose
Document the canonical TypeScript domain interfaces used by the grocery ecommerce UI and describe usage patterns, derivations, and evolution guidelines. Mirrors `src/interfaces/domain.ts` and drives generation of accompanying mock datasets at `src/mocks/data.mock.ts`.

## Generation Scope
When this prompt is executed it MUST produce BOTH:
1. Interface module: `src/interfaces/domain.ts`
  - The `src/interfaces/domain.ts` contents must be exactly as in the file `data-models.example.md` provided alongside this prompt.
2. Mock data module: `src/mocks/data.mock.ts` exporting `mockProducts`, `mockCategories`, `mockPromotions`, `mockSlides`
	- The `src/mocks/data.mock.ts` contents must be exactly as in the file `data-mock.example.md` provided alongside this prompt (character-for-character, including ordering and comments).

Optional (future): colocated spec `src/mocks/data.mock.spec.ts` asserting array lengths, discount derivation for a product with `originalPrice`, and category/product relational integrity.

## Interfaces (Current)
- Product: identity + merchandising data; single price field with optional `originalPrice` enabling discount calculations.
- Category: high‑level grouping; optional `imageUrl` and `productCount` for UI richness.
- Deal: supplemental descriptor (not yet heavily used) for labeling time‑bound promos; discount can be derived instead of stored.
- Promotion: marketing tile data powering `PromotionBanner` (background image + overlay text + optional CTA).
- CarouselSlide: hero marketing content consumed by `Carousel`.
- FeatureFlagsConfig: environment-driven conditional rendering control.
- Utility: `deriveDiscount(product)` computes integer percentage off when `originalPrice > price`.

## Product Interface Shape
```ts
interface Product {
	id: string;
	name: string;
	imageUrl: string;
	price: number;          // current price
	originalPrice?: number; // if present & > price => deal
	currency: string;       // e.g. '$'
	rating?: number;        // 0-5
	badges?: string[];      // e.g. ['deal','new']
	categoryId?: string;
}
```
Rationale: collapsed pricing model keeps MVP simple; future multi-price (unit/regular/current) can expand without breaking existing components by introducing a new optional object.

## Discount Derivation
Use `deriveDiscount(product)` to avoid storing duplicate percentage fields. Components may call it to display a badge (future enhancement for `ProductCard`).

## Mock Data Alignment & Generation Rules
- Discounted products supply both `price` and higher `originalPrice` plus `badges: ['deal']`.
- New products flagged with `badges: ['new']`.
- All product images now sourced from `/assets/homepage/deals/*.png` for visual consistency (including dairy & berries variants). Note: current file set includes a typo `cheedar-cheese.png` retained intentionally until asset corrected.
- Category images reuse two of these deal assets (banana, greek-yogurt) and are displayed at 100px in `CategoryGrid`.
- Promotion & carousel assets live under `/assets/homepage/promotions/` and `/assets/homepage/carousel/` respectively.

Mock Module Requirements (`src/mocks/data.mock.ts`):
- Use named exports for each array: `export const mockProducts: Product[] = [...]` etc.
- Keep deterministic ordering (stable IDs) to simplify snapshot or behavior tests.
- Do NOT introduce network/access logic; pure static data only.
- Each `Product` with `originalPrice` must also include `'deal'` in `badges`.
- Provide at least one product with `'new'` badge to exercise conditional UI rendering.
- Ensure every `product.categoryId` (if present) matches an existing `Category.id`.
- Carousel slides require unique `id` and alt text (a11y test target).

## Evolution Guidelines
1. Add new fields as optional to preserve backwards compatibility.
2. When introducing structured price, keep legacy `price` until all consumers migrate.
3. Prefer derived over stored values (e.g., discountPercentage). Store only if source data requires authoritative value.
4. Deprecate by comment first; remove in a major version increment.

## Testing Considerations
- Interfaces compile-time only: rely on component tests for behavior (e.g., deals filtering in `HomepageView` using `originalPrice`).
- Add tests when new optional fields change rendering logic (e.g., future discount badge).
- Optional mock data spec may assert: lengths > 0, discount percentage derived via `deriveDiscount`, all category IDs resolve, and no empty alt strings on slides.

## Future Extensions
- Inventory status on `Product` (in/out of stock) for conditional badge.
- Localization of `currency` and price formatting utility.
- Rich category metadata (SEO slug, hero image) in advanced merchandising flows.

Refer to updated `data-models.example.md` for exact code listing and `data-mock.example.md` for canonical mock content.

## Mandatory Final Step

After completing the above tasks, perform a thorough review of both generated files to ensure:
- For all your validation checks below, make sure to read the actual generated files from disk.
- All interfaces created in `src/interfaces/domain.ts` must match the specified shapes defined in `data-models.example.md`.
- The Mock file was generated properly based on these rules:
	- There is ONLY one mock file: `src/mocks/data.mock.ts` (no variants, no duplicates).
	- The contents of `src/mocks/data.mock.ts` are exactly the same as `docs/prompts/coding/data/data-mock.example.md` (byte-for-byte; same ordering, IDs, comments, alt text).
	- No additional mock or interface files exist (e.g., no `data.mock.copy.ts`, no `domain.alt.ts`).
	- If any divergence was required, the corresponding example file was updated in the same change and justification was output.