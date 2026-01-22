# deal-badge.prompt.md

## Purpose
Highlight a promotional deal associated with a product (e.g., "BOGO", "% OFF").

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| promo | `Promotion | null` | required | Fields: id, label, type |

## Behavior
- If `promo` falsy -> render nothing.
- Show short `promo.label` text.
- Optional style variant by `promo.type` (e.g., `percent`, `bogo`).

## Accessibility
- Badge `span` with `aria-label="Promotion: {label}"`.

## Styling
- Pill / rounded rectangle; accent background; small uppercase text.
- Use token radius and spacing.

## Edge Cases
- Extremely long label -> truncate with ellipsis (title attribute full text).

## Testing (DealBadge.spec.ts)
1. Null promo -> not rendered.
2. Renders label text.
3. Applies variant class when `type` present.

Refer to `deal-badge.example.md`.

## Generation Parity Requirement
`src/components/DealBadge.vue` MUST replicate `deal-badge.example.md` verbatim. Steps:
1. Read `docs/prompts/coding/components/deal-badge.example.md`.
2. Copy template/script/style blocks exactly—no prop renames, no style tweaks.
3. Keep ordering & whitespace (except unavoidable editor EOL normalization).
4. Modify example first if future changes needed; never alter implementation without updating example.
