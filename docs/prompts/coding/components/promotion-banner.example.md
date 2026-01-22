# promotion-banner.example.md

// SOURCE OF TRUTH: Generated `src/components/PromotionBanner.vue` MUST match this example. Banner layout & CTA align with promotions strip in `home.png`. Sync prompt if altered.

```vue
<template>
  <section
    class="promotion-banner"
    aria-label="Promotion banner"
    :style="imageUrl ? { backgroundImage: 'url(' + imageUrl + ')' } : {}"
  >
    <div class="promotion-banner__content">
      <h2 class="promotion-banner__title">{{ title }}</h2>
      <p v-if="description" class="promotion-banner__desc">{{ description }}</p>
      <a v-if="ctaText" :href="ctaHref" class="promotion-banner__cta">{{ ctaText }}</a>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'PromotionBanner',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: false },
    ctaText: { type: String, required: false },
    ctaHref: { type: String, required: false },
    imageUrl: { type: String, required: false }
  }
});
</script>
<style scoped>
.promotion-banner {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 180px;
  background: var(--color-primary-accent);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: var(--radius-md);
  overflow: hidden;
  color: #fff;
}
.promotion-banner__content { background: rgba(0,0,0,0.40); padding: var(--space-4) var(--space-5); width: 100%; text-align: center; }
.promotion-banner__title { margin: 0 0 var(--space-2); font-size: 1.25rem; line-height: 1.2; }
.promotion-banner__desc { margin: 0 0 var(--space-3); }
.promotion-banner__cta { color: #fff; text-decoration: underline; font-weight: 600; }
.promotion-banner__cta:hover { text-decoration: none; }
</style>
```