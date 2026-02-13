<template>
  <header class="header">
    <div class="header-top">
      <div class="header-container">
        <router-link to="/" class="header-logo">
          <img src="/assets/header/logo.png" alt="Stop & Shop" class="header-logo-image" />
        </router-link>

        <div class="header-search">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search Groceries" 
            class="header-search-input"
            aria-label="Search groceries"
            @keyup.enter="handleSearch"
          />
          <button class="header-search-button" aria-label="Search" @click="handleSearch">
            <span class="header-search-icon">🔍</span>
          </button>
        </div>

        <div class="header-actions">
          <a href="#" class="header-sign-in">Sign In</a>
          <router-link to="/cart" class="header-cart-button" aria-label="Shopping cart">
            <span class="header-cart-price">{{ formatPrice(cartTotal) }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="header-bottom">
      <div class="header-container">
        <nav class="header-nav" aria-label="Main navigation">
          <ul class="header-nav-list">
            <li><a href="#" class="header-nav-link">Shop</a></li>
            <li><a href="#" class="header-nav-link">Weekly Ad</a></li>
            <li><a href="#" class="header-nav-link">Recipes</a></li>
            <li><a href="#" class="header-nav-link">Pharmacy</a></li>
            <li><a href="#" class="header-nav-link">Delivery & Pickup</a></li>
          </ul>
        </nav>

        <div class="header-location">
          In-Store at <strong>1001 Route 6, 1054</strong>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mockProducts } from '@/mocks/data.mock';

export default defineComponent({
  name: 'Header',
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    cartItemCount(): number {
      return this.$store.getters['cart/itemCount'] || 0;
    },
    cartTotal(): number {
      return this.$store.getters['cart/subtotal'] || 0;
    },
  },
  methods: {
    formatPrice(price: number): string {
      return `$${price.toFixed(2)}`;
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        
        // Search for exact or partial match in product names
        const matchedProduct = mockProducts.find(product => 
          product.name.toLowerCase().includes(query)
        );

        if (matchedProduct) {
          // Navigate to product details if found
          this.$router.push({
            name: 'product-details',
            params: { id: matchedProduct.id },
          });
          this.searchQuery = ''; // Clear search after navigation
        } else {
          // Navigate to product listing with search query if no match
          this.$router.push({
            name: 'product-listing',
            query: { search: query },
          });
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  background-color: white;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid #e5e5e5;
}

.header-bottom {
  background-color: #f8f8f8;
  padding: var(--spacing-sm) 0;
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.header-logo-image {
  height: 32px;
  width: auto;
}

.header-search {
  flex: 1;
  max-width: 600px;
  display: flex;
  align-items: center;
  border: 2px solid #e5e5e5;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.header-search-input {
  flex: 1;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  outline: none;

  &::placeholder {
    color: #999;
  }
}

.header-search-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #f5f5f5;
  }
}

.header-search-icon {
  font-size: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-sign-in {
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  white-space: nowrap;

  &:hover {
    color: var(--color-primary);
  }
}

.header-cart-button {
  background-color: #e61e50;
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  white-space: nowrap;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: #c91847;
  }
}

.header-cart-price {
  display: flex;
  align-items: center;
}

.header-nav-list {
  display: flex;
  gap: var(--spacing-xl);
  margin: 0;
  padding: 0;
  list-style: none;
}

.header-nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: 15px;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }
}

.header-location {
  color: var(--color-text);
  font-size: 14px;
  white-space: nowrap;

  strong {
    font-weight: var(--font-weight-medium);
  }
  font-weight: var(--font-weight-bold);
  min-width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-xs);
}
</style>
