# Components Prompts & Examples

Moved from `docs/prompts/components` to `docs/prompts/coding/components`.

| Component | Prompt | Example |
|-----------|--------|---------|
| HeaderBar | header.prompt.md | header.example.md |
| Carousel | carousel.prompt.md | carousel.example.md |
| CategoryGrid | category-grid.prompt.md | category-grid.example.md |
| ProductCard | product-card.prompt.md | product-card.example.md |
| PriceTag | price-tag.prompt.md | price-tag.example.md |
| PromotionBanner | promotion-banner.prompt.md | promotion-banner.example.md |
| DealBadge | deal-badge.prompt.md | deal-badge.example.md |
| FooterLinks | footer.prompt.md | footer.example.md |
| SearchBar | search-bar.prompt.md | search-bar.example.md |
| CartSummaryBadge | cart-summary-badge.prompt.md | cart-summary-badge.example.md |

## Conventions
- Preserve Options API exclusively.
- Examples are skeletal; generation phase will enrich with props validation, a11y, and tests.
- SCSS tokens assumed available globally via Vite `additionalData` injection.

## Next Steps
Generate actual component code in `src/components/` mirroring example structure and add colocated `*.spec.ts` tests per testing prompt.
