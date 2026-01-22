# footer.example.md

// SOURCE OF TRUTH: Generated `src/components/Footer.vue` MUST match this example exactly. Provides branding via optional `brand` prop (defaults to APP_NAME) and renders grouped link lists. Update here first for any intentional change.

```vue
<template>
  <footer class="site-footer" role="contentinfo" :aria-label="(brand || appName) + ' footer'">
    <div class="footer__branding">
      <strong class="footer__brand">{{ brand || appName }}</strong>
    </div>
    <div class="footer__groups" v-if="groups.length">
      <div v-for="g in groups" :key="g.heading" class="footer__group">
        <h4 class="footer__group-heading">{{ g.heading }}</h4>
        <ul class="footer__links">
          <li v-for="l in g.links" :key="l.href" class="footer__link-item">
            <a :href="l.href" class="footer__link">{{ l.label }}</a>
          </li>
        </ul>
      </div>
    </div>
    <small class="footer__disclaimer">All product information is mock data for demo purposes.</small>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { APP_NAME } from '@/shared/EnvConsts';
interface FooterLinkGroup { heading: string; links: { label: string; href: string }[] }
export default defineComponent({
  name: 'Footer',
  props: {
    brand: { type: String, default: () => APP_NAME },
    groups: { type: Array as () => FooterLinkGroup[], default: () => [] }
  },
  data() {
    return { appName: APP_NAME };
  }
});
</script>
<style scoped>
.site-footer { background: var(--color-bg-section); padding: var(--space-6) var(--space-4); margin-top: var(--space-8); display: flex; flex-direction: column; gap: var(--space-6); }
.footer__branding { font-size: var(--font-size-md); font-weight: var(--font-weight-bold); color: var(--color-text); }
.footer__groups { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); }
.footer__group-heading { font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: .05em; margin: 0 0 var(--space-2); }
.footer__links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.footer__link { text-decoration: none; font-size: var(--font-size-sm); color: var(--color-text); }
.footer__link:hover { color: var(--color-brand-medium); }
.footer__disclaimer { font-size: var(--font-size-xs); color: var(--color-text-muted); }
@media (max-width: 600px) {
  .site-footer { padding: var(--space-6) var(--space-3); }
}
</style>
```