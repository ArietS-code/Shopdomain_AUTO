# category-grid.prompt.md

## Purpose
Render a responsive, centered grid of top-level product categories showing an image (sourced from deals assets) and label.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| categories | `Category[]` | required | Each item: id, name, optional imageUrl, productCount |

## Behavior
- Iterates categories; each tile currently non-clickable (presentational). Future enhancement: wrap each in `RouterLink` to `/category/{id}`.
- Grid auto-fills via `repeat(auto-fill,minmax(120px,1fr))`.
- Category images are constrained to 100px width, centered within tile for consistent visual rhythm.

## Accessibility
- Wrapper section uses `aria-label="Shop by category"`.
- Images have `alt` = category name.
- Text label always present ensuring readable name when image missing.

## Edge Cases
- Empty array -> renders empty grid (homepage still displays heading externally for layout stability).
- Missing imageUrl -> image element omitted; label still shown (could add colored placeholder later).

## Testing (CategoryGrid.spec.ts)
1. Renders expected number of tiles.
2. Empty categories -> renders without error (no tiles).
3. Image sizing rule applied (class or style check on img width 100px).
4. Omits img when `imageUrl` undefined.

Refer to updated `category-grid.example.md` for baseline.

## Generation Parity Requirement
Generated `src/components/CategoryGrid.vue` MUST match `category-grid.example.md` exactly (template, script, style blocks). Steps:
1. Open `docs/prompts/coding/components/category-grid.example.md`.
2. Copy content verbatim—no additional props, no style changes, no reformatting.
3. Preserve comment headers and ordering.
4. To change implementation later, modify the example first, then regenerate to keep prompt/example parity.
