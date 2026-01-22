# header.prompt.md

## Purpose
Site banner combining branding (logo + home link), primary navigation, search capability, user placeholders (Sign In), cart summary, and store context. Simplified two-row layout (primary + secondary) for MVP; no mobile drawer yet.
This component is consumed exclusively by the global layout (`layout/layout.prompt.md`); individual view components MUST NOT import or render `Header` directly.

## Structure Requirements
1. Primary Row (`.header-row--primary`): grid columns [logo | search | actions]. Actions contain Sign In button and Cart button (amount precedes icon).
2. Secondary Row (`.header-row--secondary`): [navigation | store context]. Hidden under mobile breakpoint (<960px).
3. No mobile drawer/hamburger in current scope; future enhancement only.

## Data / State
Internal `nav` array of items: `{ id, label }` placeholder entries (Shop, Weekly Ad, Recipes, Pharmacy, Delivery & Pickup). Each renders a `<router-link>` to `/product-listing` (MVP shortcut until distinct categories implemented).
- `searchQuery` string bound to `<input type="search">` via `v-model`.
- Computed `cartSubtotal` derived from Vuex getter `cart/cartSubtotal` and formatted to `$0.00` style.
- No mobile state currently.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| title | `string` | `APP_NAME` (optional) | Used for logo alt/aria; falls back to `APP_NAME` to avoid runtime warnings if not passed. Layout SHOULD still provide explicit `:title`. |

## Events
| Name | Payload | When |
|------|---------|------|
| `search` | trimmed search string | On form submit (`@submit.prevent`). |

## Behavior
- Submit search form emits `search` with trimmed query.
- Cart button shows dynamic subtotal (formatted `$<amount>` with two decimals) and icon; clicking navigates to `/cart`.
- Sign In placeholder button.
- Logo static `<img src="/assets/header/logo.png">`.

## Accessibility
- `<header>` acts as banner; no redundant `role="banner"` needed (native landmark).
- Logo link has `:aria-label="title + ' home'"`; image `:alt="title + ' logo'"`.
- Navigation: `<nav aria-label="Primary navigation">` contains unordered list of `<router-link>` items (all route to `/product-listing`).
- Search form uses semantic `<form role="search">` with labeled input via `aria-label`.
- Hamburger button has `aria-label="Open menu"` and `:aria-expanded` bound to state.
- Distinct landmark/region labels for top utility strip (`aria-label="Utility strip"`) and actions (`aria-label="User actions"`).
- Focus states rely on existing token colors (use `--color-primary` / `--color-primary-accent`).

## Responsive Rules
- Desktop: both rows visible.
- Tablet/Mobile (<960px): secondary row hidden; primary row columns use flexible `minmax()` grid to shrink (logo / search / actions).
- Extra Small (<600px): primary row stacks into a single column (logo, search, actions vertically), actions may wrap.

## Styling Guidelines
- Brand palette (updated): deep `--color-brand-deep` (#e0004d) base for cart; hover medium `--color-brand-medium`; lighter accents available (`--color-brand-accent`, `--color-brand-warm`).
- Row heights: `--header-height-primary`, `--header-height-secondary`.
- Spacing: rely on `--space-*` tokens (actions gap uses `--space-4`).
- Search bar: pill radius `--search-radius`, surface background, subtle inset border.
- Navigation: underline hover animation via pseudo-element and color shift to medium.
- Letter-spacing tighten via `--letter-tight` for compact look.
- Elevation: header shadow `--elevation-1`.
- Responsive: hide secondary row under 960px; stack all primary items under 600px.
- Remove hard `width: 100%` from `.header-row`; let grid naturally size within layout container.

## Testing (Header.spec.ts)
1. Logo element exists with alt text including provided title.
2. Primary navigation renders >= 5 items linking to `/product-listing`.
3. Search input placeholder "Search Groceries" enabled (not disabled).
4. Cart subtotal updates when items added (mock store dispatch and assert text change from `$0.00` to expected value).
5. Store context text includes location placeholder.
6. Fallback: When mounted WITHOUT passing `title`, alt text derives from `APP_NAME` (no missing required prop warning in console).

Optional future tests: verify each nav link destination, focus-visible outline, contrast ratios, mobile collapse behavior when implemented.

## Non-Goals (for MVP)
- Dynamic cart count
- User authentication/account dropdown
- Store selector geolocation
- Live search autocomplete

See `header.example.md` (updated) for implementation reference.

## Generation Parity Requirement
`src/components/Header.vue` MUST match `header.example.md` exactly. Procedure:
1. Read the example file before emitting code.
2. Copy template/script/style verbatim (keep prop name `title`, computed getters, aria attributes, token usage, and comments).
3. Do not reorder nav items, alter markup hierarchy, or adjust spacing tokens.
4. Any future change must be applied to `header.example.md` first, then regenerated to keep strict parity.
