# cart.example.md

// SOURCE OF TRUTH: Generated `src/views/CartView.vue` MUST match this example. Item list, quantity controls, subtotal and checkout modal must reproduce `cart.png`. Any divergence requires updating this example first.

```vue
<!-- CartView.vue -->
<template>
  <div class="cart-view" aria-label="Cart">
    <h1 class="cart-view__title">Your Cart</h1>

    <div class="cart-layout">
      <section class="cart-summary" aria-label="Cart summary">
        <h2>Subtotal</h2>
        <p class="subtotal-amount">${{ subtotal.toFixed(2) }}</p>
        <div class="cart-actions">
          <router-link to="/product-listing" class="continue" aria-label="Continue Shopping">Continue Shopping</router-link>
          <button :disabled="!hasItems" @click="onCheckout" aria-label="Checkout" class="checkout">Checkout</button>
        </div>
      </section>

      <section class="cart-items-section" aria-label="Items">
        <ul v-if="items.length" aria-label="Cart items" class="cart-items">
          <li v-for="item in items" :key="item.id" class="cart-item">
            <img :src="item.imageUrl" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <div class="quantity-controls" aria-label="Quantity Controls">
                <button @click="decrement(item)" aria-label="Decrement Quantity" class="qty-btn">-</button>
                <span class="qty-badge" aria-label="Item Quantity">{{ item.quantity }}</span>
                <button @click="increment(item)" aria-label="Increment Quantity" class="qty-btn">+</button>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="empty-message">Your cart is empty.</p>
      </section>
    </div>

    <div v-if="showSuccess" role="dialog" aria-modal="true" aria-label="Checkout Success" class="success-modal">
      <div class="modal-content">
        <h2>Order Placed!</h2>
        <p>Your order has been placed successfully.</p>
        <button @click="closeModal" aria-label="Close Modal" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CartView',
  setup() {
    const store = useStore();
    const showSuccess = ref(false);

    const items = computed(() => store.getters['cart/cartItems']);
    const subtotal = computed(() => store.getters['cart/cartSubtotal']);
    const hasItems = computed(() => items.value.length > 0);

    const increment = (item: any) => {
      store.dispatch('cart/addToCart', item);
    };

    const decrement = (item: any) => {
      // Direct state mutation (will be refactored to a mutation in future step)
      const existing = items.value.find((i: any) => i.id === item.id);
      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity <= 0) {
          const idx = store.state.cart.items.findIndex((i: any) => i.id === item.id);
          if (idx !== -1) store.state.cart.items.splice(idx, 1);
        }
      }
    };

    const onCheckout = () => {
      if (!hasItems.value) return;
      showSuccess.value = true;
      store.dispatch('cart/clearCart');
    };

    const closeModal = () => {
      showSuccess.value = false;
    };

    return { items, subtotal, hasItems, increment, decrement, onCheckout, showSuccess, closeModal };
  }
});
</script>

<style scoped>
.cart-view { padding: var(--space-6); max-width: var(--layout-container-max); margin: 0 auto; border: 1px solid var(--color-border); background: var(--color-bg-section); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-6); }
.cart-view__title { margin: 0; font-size: var(--font-size-xl); letter-spacing: var(--letter-tight); text-align: center; }
.cart-layout { display: flex; gap: var(--layout-grid-gap); align-items: flex-start; }
.cart-summary { width: 320px; padding: var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-alt); display: flex; flex-direction: column; gap: var(--space-4); }
.subtotal-amount { font-size: var(--font-size-lg); font-weight: 600; margin: 0; }
.cart-actions { display: flex; gap: var(--space-4); }
.cart-actions .continue, .cart-actions .checkout { flex: 1; text-align: center; padding: var(--space-3) var(--space-4); border: none; background: var(--color-brand-deep); color: #fff; border-radius: var(--radius-sm); text-decoration: none; cursor: pointer; font-weight: 600; letter-spacing: var(--letter-tight); }
.cart-actions .continue { background: var(--color-brand-medium); }
.cart-actions .checkout:disabled { opacity: 0.5; cursor: not-allowed; }
.cart-items { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-4); }
.cart-item { display: flex; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; }
.item-image { width: 90px; height: 90px; object-fit: cover; border-radius: var(--radius-sm); }
.item-info { flex: 1; display: flex; flex-direction: column; gap: var(--space-2); }
.item-name { margin: 0; font-size: var(--font-size-md); font-weight: 600; }
.item-price { margin: 0; font-weight: 600; }
.quantity-controls { display: flex; align-items: center; gap: var(--space-2); }
.qty-btn { width: 32px; height: 32px; border: 1px solid var(--color-border); background: var(--color-bg); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--font-size-md); line-height: 1; font-weight: 600; }
.qty-badge { min-width: 28px; text-align: center; font-weight: 600; }
.empty-message { font-style: italic; color: var(--color-text-muted); }
.success-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: #fff; padding: var(--space-6); border-radius: var(--radius-lg); width: 360px; text-align: center; border: 1px solid var(--color-border); }
.close-btn { margin-top: var(--space-4); padding: var(--space-3) var(--space-4); border: none; background: var(--color-brand-deep); color: #fff; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; }
@media (max-width: 800px) { .cart-layout { flex-direction: column; } .cart-summary { width: 100%; order: -1; } }
@media (max-width: 640px) { .cart-view { padding: var(--space-5) var(--layout-page-padding-mobile-x); } }
</style>
```
