# cart-summary-badge.example.md

// SOURCE OF TRUTH: Generated `src/components/CartSummaryBadge.vue` MUST be byte-for-byte identical to this example. Badge count, aria attributes, and styling must match screenshots (`home.png` header cart indicator, `cart.png`). Modify here first if changes are needed.

```vue
<template>
  <div class="cart-summary" aria-label="Shopping cart" :data-has-items="count > 0">
    🛒<span v-if="count > 0" class="badge">{{ count }}</span>
  </div>
</template>
<script lang="ts">export default { name: 'CartSummaryBadge', props: { count: { type: Number, default: 0 } } };</script>
<style scoped>
.cart-summary { position: relative; display: inline-flex; align-items: center; }
.badge { background: $color-brand-highlight; color: $color-text-inverse; font-size: $font-size-xs; min-width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: $radius-pill; position: absolute; top: -6px; right: -10px; }
</style>
```