# header.example.md

// SOURCE OF TRUTH: Generated `src/components/Header.vue` MUST match this example exactly (including aria roles, navigation markup, cart badge slot/area). Visual parity with `home.png`, `prod-listing.png`, `prod-details.png`, `cart.png`. Update here first if changes needed.

```vue
<template>
  <header class="site-header">
    <!-- Primary Row -->
    <div class="header-row header-row--primary">
      <div class="header-col header-col--logo">
        <a href="/" class="logo-link" :aria-label="title + ' home'">
          <img class="logo" src="/assets/header/logo.png" :alt="title + ' logo'" />
        </a>
      </div>
      <div class="header-col header-col--search">
        <form class="search-bar" role="search" @submit.prevent="onSearch">
          <input
            class="search-bar__input"
            type="search"
            placeholder="Search Groceries"
            aria-label="Search Groceries"
            v-model="searchQuery"
          />
          <button class="search-bar__button" type="submit" aria-label="Search">🔍</button>
        </form>
      </div>
      <div class="header-col header-col--actions">
        <button class="sign-in-btn" type="button" aria-label="Sign In">Sign In</button>
        <router-link to="/cart" class="cart-btn" :aria-label="'Cart ' + cartSubtotal">
          <span class="cart-btn__amount">{{ cartSubtotal }}</span>
          <img src="/assets/header/cart.png" alt="Cart icon" class="cart-btn__icon" />
        </router-link>
      </div>
    </div>
    <!-- Secondary Row -->
    <div class="header-row header-row--secondary">
      <nav class="primary-nav" aria-label="Primary navigation">
        <ul class="primary-nav__list">
          <li v-for="item in nav" :key="item.id" class="primary-nav__item">
            <router-link :to="'/product-listing'" class="primary-nav__link">{{ item.label }}</router-link>
          </li>
        </ul>
      </nav>
      <div class="store-context" aria-label="Store context">
        In-Store at <span class="store-context__location">1001 Route 6, 10541</span>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { APP_NAME } from '@/shared/EnvConsts';
interface NavItem { id: string; label: string }
export default defineComponent({
  name: 'Header',
  // Title prop now optional with default fallback to APP_NAME to prevent missing required prop warnings.
  // Layout SHOULD still pass :title explicitly; fallback ensures resilience if omitted in tests or future refactors.
  props: { title: { type: String, default: () => APP_NAME } },
  data() {
    return {
      nav: [
        { id: 'shop', label: 'Shop' },
        { id: 'weekly-ad', label: 'Weekly Ad' },
        { id: 'recipes', label: 'Recipes' },
        { id: 'pharmacy', label: 'Pharmacy' },
        { id: 'delivery', label: 'Delivery & Pickup' }
      ] as NavItem[],
      searchQuery: ''
    };
  },
  computed: {
    store() { return useStore(); },
    cartSubtotal(): string {
      const subtotal = this.store.getters['cart/cartSubtotal'] || 0;
      return `$${subtotal.toFixed(2)}`;
    }
  },
  methods: {
    onSearch() { this.$emit('search', this.searchQuery.trim()); }
  }
});
</script>
<style scoped>
.site-header { background: var(--color-bg); box-shadow: var(--elevation-1); }
.header-row { display: grid; align-items: center; letter-spacing: var(--letter-tight); }
.header-row--primary { grid-template-columns: minmax(120px,160px) minmax(0,1fr) minmax(160px,220px); height: var(--header-height-primary); padding: 0 var(--space-6); }
.header-row--secondary { grid-template-columns: 1fr auto; height: var(--header-height-secondary); padding: 0 var(--space-6); border-top: 1px solid var(--color-border); }
.logo-link { display: inline-flex; align-items: center; }
.logo { height: 48px; width: auto; display: block; }
.header-col--search { display: flex; justify-content: center; min-width: 0; }
.header-col--actions { display: flex; justify-content: flex-end; gap: var(--space-4); flex-wrap: wrap; min-width: 0; }
.search-bar { display: flex; width: 100%; max-width: 640px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--search-radius); padding: 0 var(--space-3); }
.search-bar__input { flex: 1; border: none; background: transparent; padding: var(--space-2) 0; font-size: var(--font-size-md); }
.search-bar__input:focus { outline: none; }
.search-bar__button { border: none; background: none; cursor: pointer; font-size: var(--font-size-lg); display: flex; align-items: center; padding: 0 var(--space-2); color: var(--color-muted); }
.sign-in-btn { background: none; border: none; font-size: var(--font-size-sm); font-weight: 600; cursor: pointer; padding: var(--space-2) var(--space-3); }
.cart-btn { display: inline-flex; align-items: center; gap: var(--space-2); background: var(--color-brand-deep); color: #fff; border: none; padding: var(--space-2) var(--space-4); border-radius: 40px; font-weight: 600; cursor: pointer; font-size: var(--font-size-sm); transition: background .15s ease; }
.cart-btn:hover { background: var(--color-brand-medium); }
.cart-btn__icon { height: 20px; width: 20px; display: block; }
.primary-nav__list { list-style: none; display: flex; gap: var(--space-6); margin: 0; padding: 0; }
.primary-nav__link { text-decoration: none; font-weight: 600; color: var(--color-text); font-size: var(--font-size-sm); position: relative; padding: var(--space-2) 0; }
.primary-nav__link:hover { color: var(--color-brand-medium); }
.primary-nav__link:after { content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 0; background: var(--color-brand-medium); transition: width .15s ease; }
.primary-nav__link:hover:after { width: 100%; }
.store-context { font-size: var(--font-size-sm); color: var(--color-text); font-weight: 500; }
.store-context__location { font-weight: 600; }
@media (max-width: 960px) {
  .header-row--primary { grid-template-columns: minmax(110px,130px) minmax(0,1fr) minmax(130px,170px); padding: var(--space-3) var(--space-4); }
  .header-row--secondary { display: none; }
  .primary-nav__list { flex-wrap: wrap; gap: var(--space-4); }
  .search-bar { max-width: 100%; }
  .cart-btn { padding: var(--space-2) var(--space-3); }
}
@media (max-width: 600px) {
  .header-row--primary { grid-template-columns: 1fr; row-gap: var(--space-3); }
  .header-col--logo, .header-col--search, .header-col--actions { justify-content: center; }
  .header-col--actions { gap: var(--space-3); }
}
</style>
```