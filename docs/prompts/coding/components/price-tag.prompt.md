# price-tag.prompt.md

## Purpose
Display current price and optional regular price if discounted.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| price | `number` | required | Current selling price |
| originalPrice | `number` | undefined | Previous/regular price when discounted (must be > price to show) |
| currency | `string` | `$` | Currency symbol prefix |

## Behavior
- Compute `hasDiscount = originalPrice !== undefined && originalPrice > price`.
- Use computed strings `formattedPrice` and `formattedOriginalPrice` (the latter empty string if missing) to avoid template non-null assertions.
- If discount true: render regular (struck-through) then current; otherwise only current.
- Format with `currency` prefix and two decimals.
- No display of regular price if `originalPrice <= price` or missing.

## Accessibility
- `aria-label="Regular price"` on struck-through span only when discount.
- `aria-label="Current price"` on current span.

## Testing (PriceTag.spec.ts)
1. No `originalPrice` -> only current span rendered.
2. `originalPrice <= price` -> treat as no discount (only current).
3. `originalPrice > price` -> both spans rendered; `regular` has strike-through class.
4. Formatting includes currency symbol and two decimals.
5. Edge: extremely large price still formats; negative price should be rejected (spec can assert warning or throw if implemented later).

Edge cases: Negative values should not appear (optional assertion in spec).

Refer to `price-tag.example.md` for implementation (must be copied verbatim). Non-null assertion (`originalPrice!`) MUST NOT appear in template to prevent lint parsing issues.

## Generation Parity Requirement
`src/components/PriceTag.vue` MUST be identical to `price-tag.example.md`. Steps:
1. Open example file; verify computed properties (`hasDiscount`, `formattedPrice`, `formattedOriginalPrice`) exist.
2. Copy entire SFC blocks exactly (no added formatting helpers or alternative discount logic).
3. Ensure absence of `originalPrice!` assertion as enforced.
4. Update example first for any future change; regenerate after updating to maintain parity.
