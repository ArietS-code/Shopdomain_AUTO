<template>
  <div class="product-listing">
    <h1 class="product-listing-title">
      {{ searchQuery ? `Search Results for "${searchQuery}"` : 'All Products' }}
    </h1>
    <p v-if="searchQuery && products.length === 0" class="no-results">
      No products found matching "{{ searchQuery }}"
    </p>
    <div class="product-listing-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.imageUrl" :alt="product.name" class="product-image" />
        <div class="product-content">
          <h3 class="product-name">{{ product.name }}</h3>
          <button @click="addToCart(product)" class="product-button">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mockProducts } from '@/mocks/data.mock';
import type { Product } from '@/interfaces/domain';

export default defineComponent({
  name: 'ProductListingView',
  data() {
    return {
      allProducts: mockProducts,
    };
  },
  computed: {
    searchQuery(): string {
      return (this.$route.query.search as string) || '';
    },
    products(): Product[] {
      if (!this.searchQuery) {
        return this.allProducts;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    formatPrice(price: number): string {
      return `$${price.toFixed(2)}`;
    },
    goToDetails(productId: string) {
      this.$router.push({ name: 'product-details', params: { id: productId } });
    },
    addToCart(product: Product) {
      this.$store.dispatch('cart/addItem', product);
    },
  },
});
</script>

<style scoped lang="scss">
.product-listing {
  background-color: white;
  min-height: calc(100vh - 200px);
  padding: var(--spacing-xl) var(--spacing-md);
}

.product-listing-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.no-results {
  text-align: center;
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
}

.product-listing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: var(--spacing-md);
  background: white;
}

.product-content {
  padding: var(--spacing-md);
  text-align: center;
}

.product-name {
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-button {
  width: 100%;
  padding: 12px var(--spacing-md);
  background-color: #e61e50;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: 15px;
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: #c91847;
  }
}
</style>
