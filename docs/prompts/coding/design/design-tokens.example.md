# design-tokens.example.md

```scss
// SOURCE OF TRUTH: Any change to this file MUST be mirrored in generated `src/theme/tokens.scss`.
// Agents generating tokens must copy this entire file verbatim. Do not reorder, rename, or remove tokens.
// Core design tokens (complete list). Newly added aliases prevent style compile errors from component examples.

// Color Palette (base)
$color-primary: #2d7a2d;
$color-primary-accent: #4caf50;
$color-bg: #ffffff;
$color-surface: #f5f7f8;
$color-text: #222222;
$color-muted: #666666;

// Added section backgrounds & alternates
$color-bg-section: $color-surface; // alias used by components
$color-bg-alt: #fafbfb; // lighter alternate background for subtle section contrast

// Text aliases & inverse
$color-text-muted: $color-muted; // alias referenced by examples
$color-text-inverse: #ffffff;

// Brand Scale (pink spectrum) + semantic aliases
$color-brand-deep: #e0004d; // primary brand deep
$color-brand-medium: #ff2e6d; // medium accent (20% lighten)
$color-brand-accent: #ff6999; // light accent (40% lighten)
$color-brand-warm: #ffc2d5; // warm highlight (70% lighten)
$color-border: #e2e5e7;

// Semantic aliases mapping to existing scale (referenced by SFC styles)
$color-brand-primary: $color-brand-deep;
$color-brand-secondary: $color-brand-medium;
$color-brand-highlight: $color-brand-accent;

// Spacing (4pt base)
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 20px;
$space-6: 24px;
$space-8: 32px;

// Font Sizes
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 20px;
$font-size-xl: 24px;

// Radii
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 16px;
$radius-pill: 9999px; // pill shapes for badges / search input

// Elevation (shadows)
$elevation-1: 0 1px 2px rgba(0,0,0,0.08);
$elevation-2: 0 2px 4px rgba(0,0,0,0.12);

// Letter Spacing
$letter-tight: -0.25px;
$letter-normal: 0;
$letter-wide: 0.5px;

// Layout / Component Dimensions
$header-height-primary: 72px;
$header-height-secondary: 44px;
$search-radius: 32px;

// Layout Spacing & Structure (new unified tokens)
// Container widths: max standard and wide variant for listing pages
$layout-container-max: 1120px; // unified max width for most centered content blocks (homepage sections, product details, deals grid)
$layout-container-wide: 1280px; // wider variant reserved for full product listing/catalog views
// Page paddings (desktop & mobile horizontal), vertical rhythm between major sections
$layout-page-padding-x: $space-6; // horizontal padding desktop
$layout-page-padding-y: $space-8; // vertical padding desktop
$layout-page-padding-mobile-x: $space-4; // horizontal padding mobile breakpoint
$layout-section-gap-y: $space-8; // vertical gap between major page sections
$layout-grid-gap: $space-5; // default gap for product/category grids (normalizes previous 16px/24px variance)
// Component-specific dimensional tokens
$carousel-min-height: 560px; // increased hero height (was 300px → 320px → 420px → now 560px) for stronger visual impact
$product-card-image-ratio: 1; // square image ratio (aspect-ratio: var(--product-card-image-ratio) / 1)

// Font Family
$font-family-base: 'Trademark', 'effra', 'Helvetica', sans-serif;
$font-weight-bold: 700;

// Exported as CSS Custom Properties
:root {
  --color-primary: #{$color-primary};
  --color-primary-accent: #{$color-primary-accent};
  --color-bg: #{$color-bg};
  --color-surface: #{$color-surface};
  --color-text: #{$color-text};
  --color-muted: #{$color-muted};
  --color-bg-section: #{$color-bg-section};
  --color-bg-alt: #{$color-bg-alt};
  --color-text-muted: #{$color-text-muted};
  --color-text-inverse: #{$color-text-inverse};
  --space-1: #{$space-1};
  --space-2: #{$space-2};
  --space-3: #{$space-3};
  --space-4: #{$space-4};
  --space-5: #{$space-5};
  --space-6: #{$space-6};
  --space-8: #{$space-8};
  --font-size-xs: #{$font-size-xs};
  --font-size-sm: #{$font-size-sm};
  --font-size-md: #{$font-size-md};
  --font-size-lg: #{$font-size-lg};
  --font-size-xl: #{$font-size-xl};
  --font-family-base: #{$font-family-base};
  --font-weight-bold: #{$font-weight-bold};
  --color-brand-deep: #{$color-brand-deep};
  --color-brand-medium: #{$color-brand-medium};
  --color-brand-accent: #{$color-brand-accent};
  --color-brand-warm: #{$color-brand-warm};
  --color-border: #{$color-border};
  --color-brand-primary: #{$color-brand-primary};
  --color-brand-secondary: #{$color-brand-secondary};
  --color-brand-highlight: #{$color-brand-highlight};
  --elevation-1: #{$elevation-1};
  --elevation-2: #{$elevation-2};
  --letter-tight: #{$letter-tight};
  --letter-normal: #{$letter-normal};
  --letter-wide: #{$letter-wide};
  --header-height-primary: #{$header-height-primary};
  --header-height-secondary: #{$header-height-secondary};
  --search-radius: #{$search-radius};
  --radius-sm: #{$radius-sm};
  --radius-md: #{$radius-md};
  --radius-lg: #{$radius-lg};
  --radius-pill: #{$radius-pill};
  --layout-container-max: #{$layout-container-max};
  --layout-container-wide: #{$layout-container-wide};
  --layout-page-padding-x: #{$layout-page-padding-x};
  --layout-page-padding-y: #{$layout-page-padding-y};
  --layout-page-padding-mobile-x: #{$layout-page-padding-mobile-x};
  --layout-section-gap-y: #{$layout-section-gap-y};
  --layout-grid-gap: #{$layout-grid-gap};
  --carousel-min-height: #{$carousel-min-height};
  --product-card-image-ratio: #{$product-card-image-ratio};
}
```