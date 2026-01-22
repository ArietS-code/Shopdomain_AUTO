# product-card.example.md

// SOURCE OF TRUTH: Generated `src/components/ProductCard.vue` MUST match this example. Structure (image, name, price, deal badge) must reproduce product tiles in `home.png`, `prod-listing.png`. Maintain ordering & tokens.

```vue
<template>
  <article class="product-card" :aria-label="name">
    <div class="media"><img :src="imageUrl" :alt="name" /></div>
    <h3 class="name">{{ name }}</h3>
    <PriceTag :price="price" :originalPrice="originalPrice" :currency="currency" />
  <button class="add-btn" @click.stop.prevent="onAdd">Add to Cart</button>
  </article>
</template>
<script lang="ts">
import { Store } from 'vuex';
export default {
  name: 'ProductCard',
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: false },
    currency: { type: String, required: true }
  },
  methods: {
    onAdd() {
      this.$emit('add-to-cart', this.id);
      const store = this.$store as Store<any>;
      if (!store) return;
      store.dispatch('cart/addToCart', {
        id: this.id,
        name: this.name,
        price: this.price,
        imageUrl: this.imageUrl,
        currency: this.currency || '$'
      });
    }
  }
};
</script>
<style scoped>
.product-card { background: var(--color-bg); border: 1px solid var(--color-surface); padding: var(--space-4); border-radius: var(--radius-sm); display: flex; flex-direction: column; }
.media { width: 100%; aspect-ratio: var(--product-card-image-ratio) / 1; overflow: hidden; border-radius: var(--radius-sm); margin-bottom: var(--space-3); display: flex; align-items: center; justify-content: center; background: var(--color-surface); }
.media img { width: 100%; height: 100%; object-fit: cover; }
.name { margin: 0 0 var(--space-2); font-size: var(--font-size-md); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.add-btn { background: var(--color-brand-deep); color: #fff; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; letter-spacing: var(--letter-tight); }
.add-btn:hover { background: var(--color-brand-medium); }
</style>
```