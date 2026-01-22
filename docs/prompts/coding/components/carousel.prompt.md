# carousel.prompt.md

Provide a promotional carousel that auto-advances and allows direct navigation via dot buttons using CSS background images with an overlay caption.

## Purpose
Rotate marketing slides (visual background + optional caption block) on a timer to surface curated campaigns.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| slides | `CarouselSlide[]` | required | Each slide requires `id`, `imageUrl`, `alt`; optional `headline`, `subheadline`, `ctaText`, `ctaHref` |
| intervalMs | `number` | 5000 | Milliseconds between auto-advances |

## Rendering Approach
- Slides rendered as `div.carousel__slide` elements with `background-image` set inline (enables easier text overlay & cover treatment without extra markup).
- Caption overlay only rendered when a `headline` exists.
- Active slide toggled with `v-show` to retain DOM/state and avoid reflow.

## Behavior
1. `startTimer()` called on mount (only meaningful if `slides.length > 1`).
2. Interval increments `currentIndex = (currentIndex + 1) % slides.length`.
3. Dot click invokes `goTo(idx)` and restarts interval for fresh cadence.
4. Restart logic prevents immediate auto-skip after a manual navigation.
 5. Inactive slides receive `aria-hidden="true"` while the active slide sets `aria-hidden="false"` for improved accessibility.
 6. Dot buttons expose `aria-selected` state, `aria-controls` linking to the slide element id, and reside within a container `role="tablist"`.

## Accessibility
- Wrapper `section` has descriptive `aria-label` ("Promotional carousel").
- Each slide: `aria-label` uses `slide.alt`; `aria-roledescription="carousel slide"` communicates semantic role.
- Dots: `aria-label` announces target slide number.
- Currently inactive slides remain in accessibility tree (improvement opportunity: set `aria-hidden="true"` on non-active slides in future iteration).
- Alt text responsibilities shift to `aria-label` since background images are decorative; copy headline/subheadline still visible text.
 - UPDATED: Non-active slides now set `aria-hidden="true"`; active slide sets `aria-hidden="false"`.
 - Dot navigation container uses `role="tablist"`; each dot has `aria-selected` and `aria-controls` referencing its slide for assistive technology clarity.

## Methods
| Method | Responsibility |
|--------|----------------|
| `startTimer()` | Clears then sets interval (only if multiple slides) |
| `clearTimer()` | Clears interval if defined |
| `goTo(idx)` | Sets index & restarts timer |

## Mock Data Alignment
`mockSlides` (see `src/mocks/data.mock.ts`) currently supplies three slides:
1. Slide 1: Full caption (headline + subheadline + CTA) using `car-3.png`.
2. Slide 2: Headline + subheadline + CTA using `car-1.png`.
3. Slide 3: Headline + CTA using `car-2.png` (no subheadline).

## Edge Cases
- 0 slides → render empty section (no nav).
- 1 slide → timer not meaningful; acceptable minor perf overhead (could guard in future).
- Missing optional text fields → caption container omitted.

## Styling Notes
-- Background: cover, center; min-height increased to 560px (historical: was 300px → 320px → 420px → now 560px) for stronger visual impact and legibility of caption over imagery.
-- Width behavior: full-bleed within its parent layout block; if nested inside a framed section keep `max-width: var(--layout-container-wide)` to allow broader panorama. Avoid constraining narrower than 1120px unless design revises.
- Caption overlay: semi-transparent dark layer, max-width ~480px, left anchored, padded using spacing tokens.
- CTA: pill-shaped button using brand color tokens with hover transition.
- Dots: small circular buttons with active state color + focus-visible outline for keyboard accessibility.

## Testing (Carousel.spec.ts)
1. Auto-advance wraps after last slide.
2. Dot click jumps to correct slide and resets interval timer (use fake timers to assert restart).
3. Caption appears only when headline present (e.g., ensure slide 3 behavior matches data shape if subheadline omitted).
 4. ARIA attributes: each inactive slide `aria-hidden="true"`; active slide `aria-hidden="false"`; dots have `aria-selected` reflecting active index and `aria-controls` pointing to slide id.
 5. Dot count equals `slides.length`.

## Future Enhancements
- Pause on hover or focus.
- Add previous/next arrow controls.
- Add `aria-live="polite"` region announcing slide changes.
- Add `aria-hidden` for inactive slides & manage focus order.
- Swipe/gesture support for touch devices.

See `carousel.example.md` for the concrete implementation excerpt.
