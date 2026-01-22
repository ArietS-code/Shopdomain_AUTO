# product-listing.example.md

// SOURCE OF TRUTH: Generated `src/views/ProductListingView.vue` MUST match this example. Semantic list markup and card arrangement must reproduce `prod-listing.png`. Update here before implementation changes.

```vue
<template>
  <div class="product-listing-page" aria-label="Product Listing Page">
    <section class="product-listing" aria-labelledby="listing-heading">
    <h1 id="listing-heading" class="listing__title">All Products</h1>
    <ul class="listing__grid">
      <li v-for="p in products" :key="p.id" class="listing__item">
        <router-link :to="'/product-details/' + p.id" class="listing__link">
          <ProductCard
            :id="p.id"
            :name="p.name"
            :image-url="p.imageUrl"
            :price="p.price"
            :original-price="p.originalPrice"
            :currency="p.currency"
            @add-to-cart="onAddToCart(p)"
          />
        </router-link>
      </li>
    </ul>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mockProducts } from '@/mocks/data.mock';
import ProductCard from '@/components/ProductCard.vue';
export default defineComponent({
  name: 'ProductListingView',
  components: { ProductCard },
  data() { return { products: mockProducts }; },
  methods: { onAddToCart(product: any) { this.$emit('add-to-cart', product.id); } }
});
</script>
<style scoped>
.product-listing { padding: var(--space-6); max-width: var(--layout-container-wide); margin: 0 auto; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); display: flex; flex-direction: column; }
.listing__title { font-size: var(--font-size-xl); margin: 0 0 var(--space-6); letter-spacing: var(--letter-tight); text-align: center; }
.listing__grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--layout-grid-gap); }
.listing__item { margin: 0; }
.listing__link { display: block; text-decoration: none; color: inherit; }
@media (max-width: 640px) { .product-listing { padding: var(--space-5) var(--layout-page-padding-mobile-x); } .listing__grid { gap: var(--space-4); } }
</style>
```
