<template>
  <div class="product-details">
    <div v-if="product" class="product-details-container">
      <img :src="product.imageUrl" :alt="product.name" class="product-details-image" />
      <div class="product-details-info">
        <h1 class="product-details-name">{{ product.name }}</h1>
        <p class="product-details-price">{{ formatPrice(product.price) }}</p>
        <p v-if="product.rating" class="product-details-rating">
          Rating: {{ product.rating }}/5
        </p>
        <button @click="addToCart" class="product-details-button">Add to Cart</button>
      </div>
    </div>
    <div v-else class="product-not-found">
      <p>Product not found</p>
      <router-link to="/product-listing">Back to Products</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mockProducts } from '@/mocks/data.mock';
import type { Product } from '@/interfaces/domain';

export default defineComponent({
  name: 'ProductDetailsView',
  data() {
    return {
      product: null as Product | null,
    };
  },
  created() {
    const productId = this.$route.params.id as string;
    this.product = mockProducts.find((p) => p.id === productId) || null;
  },
  methods: {
    formatPrice(price: number): string {
      return `$${price.toFixed(2)}`;
    },
    addToCart() {
      if (this.product) {
        this.$store.dispatch('cart/addItem', this.product);
        this.$router.push({ name: 'cart' });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.product-details-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.product-details-image {
  width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.product-details-info {
  padding: var(--spacing-lg);
}

.product-details-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.product-details-price {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
}

.product-details-rating {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.product-details-button {
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.product-not-found {
  text-align: center;
  padding: var(--spacing-2xl);
}
</style>
