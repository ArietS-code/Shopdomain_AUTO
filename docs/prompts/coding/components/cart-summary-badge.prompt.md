# cart-summary-badge.prompt.md

## Purpose
Compact indicator of cart item count for placement in header/navigation.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| count | `number` | 0 | Total items in cart |

## Behavior
- Hidden entirely (`v-if`) when `count === 0`.
- Show number; if > 99 display `99+`.

## Accessibility
- `aria-label="Cart items: X"` applied to badge container.
- Consider `role="status"` for live updates (MVP can skip ARIA live region but note future enhancement).

## Styling
- Circular badge using tokens: background `$color-accent`, text white, min size 20px.

## Edge Cases
- Negative values: treat as 0 (clamp).
- Large numbers: cap display at `99+`.

## Testing (CartSummaryBadge.spec.ts)
1. count=0 -> not rendered.
2. count=5 -> text `5`.
3. count=120 -> text `99+`.
4. aria-label reflects underlying numeric count.

Refer to `cart-summary-badge.example.md` for skeleton.

## Generation Parity Requirement
The generated implementation (`src/components/CartSummaryBadge.vue`) MUST be byte-for-byte identical to the example in `cart-summary-badge.example.md` (including markup, prop names, class names, and comments). Mandatory steps:
1. Read `docs/prompts/coding/components/cart-summary-badge.example.md` first.
2. Copy its `<template>`, `<script>`, and `<style>` blocks verbatim.
3. Do not add, remove, or reorder imports, attributes, or whitespace beyond editor normalization.
4. If any change is required, update the example file first, then regenerate—never diverge silently.
