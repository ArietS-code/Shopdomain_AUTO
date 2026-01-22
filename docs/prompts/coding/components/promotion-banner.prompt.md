# promotion-banner.prompt.md

## Purpose
Compact promotional tile rendered in a multi-column row (homepage promotions section). Each banner uses a background image with a translucent overlay for text.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| title | `string` | required | Promotion headline |
| description | `string` | – | Optional supporting copy |
| ctaText | `string` | – | CTA label if actionable |
| ctaHref | `string` | – | Destination when CTA clicked |
| imageUrl | `string` | – | Background image asset path (optional; falls back to color fill) |

## Rendering
- Root element: `<section class="promotion-banner">` with inline `background-image` style when `imageUrl` provided.
- Text content in overlay div (`promotion-banner__content`) with semi-transparent dark background for contrast.
- CTA link rendered only when both `ctaText` and `ctaHref` present.

## Behavior
- Pure presentational component; no dismiss, no internal state.
- If `imageUrl` absent, background color token provides fallback.

## Accessibility
- `aria-label="Promotion banner"` on the section to describe region.
- Overlay text provides semantic content; background treated as decorative (no `<img>` needed).
- Ensure sufficient contrast of overlay (rgba(0,0,0,0.40) + white text). Adjust for WCAG AA if images vary (future: dynamic contrast evaluation).

## Styling Guidelines
- Min-height ~180px for visual consistency.
- Background: cover, center; border-radius uses token `--radius-md`.
- Overlay padding with spacing tokens (`--space-4`, `--space-5`).
- CTA uses underline + hover removal for subtle interaction.

## Testing (PromotionBanner.spec.ts)
1. Renders title & description text.
2. Applies `backgroundImage` style when `imageUrl` provided.
3. Renders CTA link when props supplied.
4. Omits CTA when missing `ctaText` or `ctaHref`.

## Future Enhancements
- Optional sizing variants (sm, md, lg).
- Fallback skeleton while image loads (IntersectionObserver + class state).
- Analytics hook for CTA clicks.
- A11y improvement: `aria-describedby` linking to long description.

See `promotion-banner.example.md` for implementation excerpt.

## Generation Parity Requirement
`src/components/PromotionBanner.vue` MUST match `promotion-banner.example.md` verbatim. Steps:
1. Review example file (template + props + styles) before generation.
2. Copy without adding props, changing overlay opacity, or altering class names.
3. Keep ordering and whitespace; only editor EOL normalization allowed.
4. Modify example first if any evolution is needed; regenerate implementation afterward.
