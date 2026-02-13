# Feature Flags

This document lists all feature flags supported by the application through the `VITE_FEATURE_FLAGS` environment variable.

## Configuration

Feature flags are configured via the `VITE_FEATURE_FLAGS` environment variable as a comma-separated list.

**Example:**
```
VITE_FEATURE_FLAGS=showPromotions,showCarousel,showDeals
```

## Available Flags

### `showPromotions`
**Status:** Active  
**Purpose:** Controls visibility of promotional banners on the homepage.  
**Default:** Enabled in `.env.local` (disabled in production unless explicitly set)

When enabled, displays promotional content in designated banner zones.

---

### `showCarousel`
**Status:** Active  
**Purpose:** Controls the homepage carousel/slider component.  
**Default:** Enabled in `.env.local`

When enabled, renders an image carousel on the homepage showcasing featured products or campaigns.

---

### `showDeals`
**Status:** Active  
**Purpose:** Controls the deals/special offers section on the homepage.  
**Default:** Enabled in `.env.local`

When enabled, displays special deals, discounts, or time-limited offers in a dedicated section.

---

## Usage in Code

Import feature flags from `EnvConsts`:

```typescript
import { FEATURE_FLAGS_LIST } from '@/shared/EnvConsts';

if (FEATURE_FLAGS_LIST.includes('showPromotions')) {
  // Render promotions component
}
```

## Best Practices

1. **Keep flags temporary** – Remove flags and their conditional code paths once a feature stabilizes.
2. **Document thoroughly** – Update this file when adding or removing flags.
3. **Test both states** – Ensure the application works with flags enabled and disabled.
4. **Default to stable** – Production builds should default to stable feature sets; experimental flags should be opt-in.

## Lifecycle

Flags should follow this lifecycle:
1. **Introduced** – New feature under development
2. **Active** – Feature available but toggleable
3. **Stable** – Feature enabled by default; flag deprecated
4. **Removed** – Flag and conditional code removed from codebase

Keep this document synchronized with actual flag usage in `.env.example` and application code.
