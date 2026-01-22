# product-details.example.md

// SOURCE OF TRUTH: Generated `src/views/ProductDetailsView.vue` MUST match this example. Layout (image, pricing, add-to-cart) must reflect `prod-details.png`. Sync prompt if altered.

```vue
<template>
  <div class="product-details" aria-label="Product Details">
    <section v-if="product" class="details" aria-labelledby="details-heading">
      <h1 id="details-heading" class="details__title">{{ product.name }}</h1>
      <div class="details__layout">
        <div class="details__media">
          <img :src="product.imageUrl" :alt="product.name" class="details__img" />
        </div>
        <div class="details__info">
          <PriceTag :price="product.price" :originalPrice="product.originalPrice" :currency="product.currency" />
          <p v-if="product.rating" class="details__rating" aria-label="Rating">Rating: <strong>{{ product.rating.toFixed(1) }}</strong></p>
          <ul v-if="product.badges && product.badges.length" class="details__badges" aria-label="Badges">
            <li v-for="b in product.badges" :key="b" class="details__badge">{{ b }}</li>
          </ul>
          <button class="details__add" type="button" @click="onAdd" aria-label="Add to Cart">Add to Cart</button>
        </div>
      </div>
    </section>
    <section v-else class="not-found" aria-label="Not Found">
      <h1 class="not-found__title">Product Not Found</h1>
      <router-link to="/product-listing" class="not-found__link">Back to Products</router-link>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import PriceTag from '@/components/PriceTag.vue';
import { mockProducts } from '@/mocks/data.mock';
import { Product } from '@/interfaces/domain';
import { Store } from 'vuex';
export default defineComponent({
  name: 'ProductDetailsView',
  components: { PriceTag },
  data() {
    const route = useRoute();
    const id = route.params.id as string;
    const product = mockProducts.find(p => p.id === id) as Product | undefined;
    return { product };
  },
  methods: {
    onAdd() {
      if (!this.product) return;
      this.$emit('add-to-cart', this.product.id);
      const store = this.$store as Store<any>;
      if (!store) return;
      store.dispatch('cart/addToCart', {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        imageUrl: this.product.imageUrl,
        currency: this.product.currency || '$'
      });
    }
  }
});
</script>
<style scoped>
.product-details { padding: var(--space-6); max-width: var(--layout-container-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--layout-section-gap-y); border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); }
.details__title { margin: 0; font-size: var(--font-size-xl); letter-spacing: var(--letter-tight); }
.details__layout { display: grid; grid-template-columns: 420px 1fr; gap: var(--layout-grid-gap); align-items: flex-start; }
.details__media { background: var(--color-bg-alt); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); display: flex; align-items: center; justify-content: center; }
.details__img { width: 100%; height: 100%; object-fit: cover; aspect-ratio: var(--product-card-image-ratio) / 1; }
.details__info { display: flex; flex-direction: column; gap: var(--space-4); }
.details__rating { margin: 0; font-size: var(--font-size-md); }
.details__badges { list-style: none; padding: 0; margin: 0; display: flex; gap: var(--space-2); }
.details__badge { background: var(--color-brand-warm); color: var(--color-text); padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase; letter-spacing: var(--letter-tight); }
.details__add { width: fit-content; background: var(--color-brand-deep); color: #fff; border: none; padding: var(--space-2) var(--space-4); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; font-size: var(--font-size-sm); letter-spacing: var(--letter-tight); }
.details__add:hover { background: var(--color-brand-medium); }
.not-found { padding: var(--space-6); text-align: center; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); }
.not-found__title { margin: 0 0 var(--space-4); }
.not-found__link { color: var(--color-brand-deep); font-weight: 600; }
@media (max-width: 900px) { .details__layout { grid-template-columns: 320px 1fr; } }
@media (max-width: 640px) { .details__layout { grid-template-columns: 1fr; } .product-details { padding: var(--space-5) var(--layout-page-padding-mobile-x); } }
</style>
```
