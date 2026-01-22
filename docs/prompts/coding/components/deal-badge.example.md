# deal-badge.example.md

// SOURCE OF TRUTH: Generated `src/components/DealBadge.vue` MUST match this example. Discount logic depends on `deriveDiscount`; styling must align with product tiles in screenshots. Update here first for any alteration.

```vue
<template>
  <span v-if="deal" class="deal-badge" :data-type="deal.dealType">{{ deal.displayText }}</span>
</template>
<script lang="ts">
import { dealsMap } from '@/mocks/deals';
export default { name: 'DealBadge', props: { dealId: { type: String, required: true } }, computed: { deal() { return (dealsMap as any)[this.dealId]; } } };
</script>
<style scoped>
.deal-badge { background: $color-brand-secondary; color: $color-text-inverse; padding: 0 $space-2; border-radius: $radius-pill; font-size: $font-size-sm; line-height: 1.75; }
</style>
```