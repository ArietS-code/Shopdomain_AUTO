# homepage.example.md

// SOURCE OF TRUTH: Generated `src/views/HomepageView.vue` MUST match this example. Section ordering (carousel, promotions, deals, categories) reproduces `home.png`. Core sections are ALWAYS ON; deprecated flags (`showPromotions`, `showCarousel`, `showDeals`) MUST NOT gate rendering. Any change must update this example first.

Example aligned with the current always-on homepage (integrated header search; no feature flag gating of baseline sections).

```vue
<template>
  <div class="homepage" aria-label="Homepage">

  <Carousel :slides="slides" />
  <section class="promotions section-frame" aria-label="Promotions">
      <PromotionBanner
        v-for="promo in promotions"
        :key="promo.id"
        :title="promo.title"
        :description="promo.description"
        :ctaText="promo.ctaText"
        :ctaHref="promo.ctaHref"
        :imageUrl="promo.imageUrl"
      />
    </section>

  <section class="deals section-frame" aria-label="Deals">
      <h2>Deals</h2>
      <div class="deals__items">
        <router-link
          v-for="p in productsWithDeals"
          :key="p.id"
          :to="'/product-details/' + p.id"
          class="deal-link"
        >
          <ProductCard
            :id="p.id"
            :name="p.name"
            :imageUrl="p.imageUrl"
            :price="p.price"
            :originalPrice="p.originalPrice"
            :currency="p.currency"
          />
        </router-link>
      </div>
    </section>

    <section class="categories section-frame" aria-label="Categories">
      <h2 class="categories__heading">Categories</h2>
      <CategoryGrid :categories="categories" />
    </section>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Carousel from '@/components/Carousel.vue';
import PromotionBanner from '@/components/PromotionBanner.vue';
import ProductCard from '@/components/ProductCard.vue';
import CategoryGrid from '@/components/CategoryGrid.vue';
import { APP_NAME } from '@/shared/EnvConsts';
import { mockProducts, mockCategories, mockPromotions, mockSlides } from '@/mocks/data.mock';
import { Product } from '@/interfaces/domain';


export default defineComponent({
  name: 'HomepageView',
  components: { Carousel, PromotionBanner, ProductCard, CategoryGrid },
  data() {
    return {
      appName: APP_NAME,
      products: mockProducts,
      categories: mockCategories,
      promotions: mockPromotions,
      slides: mockSlides
    };
  },
  computed: {
    productsWithDeals(): Product[] {
      return this.products.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
  }
});
</script>
<style scoped>
.homepage { display: flex; flex-direction: column; gap: var(--layout-section-gap-y); padding: var(--layout-page-padding-y) var(--layout-page-padding-x); }
/* Unified section frame wrapper for homepage blocks */
.section-frame { width: 100%; max-width: var(--layout-container-max); margin-left: auto; margin-right: auto; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6); }
.promotions { flex-direction: row; flex-wrap: wrap; gap: var(--space-4); justify-content: center; align-items: stretch; }
.promotions > * { flex: 1 1 300px; min-width: 0; text-align: center; }
.deals { align-items: center; }
.deals__items { width: 100%; display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: var(--layout-grid-gap); justify-items: center; }
.categories { align-items: center; }
.categories__heading { text-align: center; margin: 0; }
.deal-link { text-decoration: none; display: block; color: inherit; }
/* CategoryGrid images constrained to 100px width (see component styles) */
</style>
```