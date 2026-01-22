# price-tag.example.md

// SOURCE OF TRUTH: Generated `src/components/PriceTag.vue` MUST match this example. Discount styling must reflect desired product card appearance across screenshots. Any change begins here.

```vue
<template>
  <div class="price-tag" :data-on-sale="hasDiscount">
    <span v-if="hasDiscount" class="regular" aria-label="Regular price">{{ formattedOriginalPrice }}</span>
    <span class="current" aria-label="Current price">{{ formattedPrice }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PriceTag',
  props: {
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: undefined },
    currency: { type: String, default: '$' }
  },
  computed: {
    hasDiscount(): boolean {
      return this.originalPrice !== undefined && this.originalPrice > this.price;
    },
    formattedPrice(): string {
      return `${this.currency}${this.price.toFixed(2)}`;
    },
    formattedOriginalPrice(): string {
      return this.originalPrice !== undefined ? `${this.currency}${this.originalPrice.toFixed(2)}` : '';
    }
  }
});
</script>
<style scoped>
.regular { text-decoration: line-through; color: var(--color-text-muted); margin-right: var(--space-2); }
.current { font-weight: var(--font-weight-bold); color: var(--color-brand-primary); }
</style>
```