<template>
  <div class="cart">
    <h1 class="cart-title">Shopping Cart</h1>

    <div v-if="!isEmpty" class="cart-container">
      <div class="cart-items">
        <div v-for="item in items" :key="item.product.id" class="cart-item">
          <img
            :src="item.product.imageUrl"
            :alt="item.product.name"
            class="cart-item-image"
          />
          <div class="cart-item-info">
            <h3 class="cart-item-name">{{ item.product.name }}</h3>
            <p class="cart-item-price">{{ formatPrice(item.product.price) }}</p>
          </div>
          <div class="cart-item-quantity">
            <button @click="decreaseQuantity(item.product.id)" class="quantity-button">-</button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.product.id)" class="quantity-button">+</button>
          </div>
          <p class="cart-item-total">{{ formatPrice(item.product.price * item.quantity) }}</p>
          <button @click="removeItem(item.product.id)" class="cart-item-remove">Remove</button>
        </div>
      </div>

      <div class="cart-summary">
        <h2 class="cart-summary-title">Order Summary</h2>
        <div class="cart-summary-row">
          <span>Subtotal:</span>
          <span class="cart-summary-value">{{ formatPrice(subtotal) }}</span>
        </div>
        <button @click="checkout" class="cart-checkout-button">Checkout</button>
      </div>
    </div>

    <div v-else class="cart-empty">
      <p>Your cart is empty</p>
      <router-link to="/product-listing" class="cart-continue-shopping">
        Continue Shopping
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { CartItem } from '@/store/cart';

export default defineComponent({
  name: 'CartView',
  computed: {
    items(): CartItem[] {
      return this.$store.getters['cart/items'];
    },
    subtotal(): number {
      return this.$store.getters['cart/subtotal'];
    },
    isEmpty(): boolean {
      return this.$store.getters['cart/isEmpty'];
    },
  },
  methods: {
    formatPrice(price: number): string {
      return `$${price.toFixed(2)}`;
    },
    increaseQuantity(productId: string) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) {
        this.$store.dispatch('cart/updateQuantity', {
          productId,
          quantity: item.quantity + 1,
        });
      }
    },
    decreaseQuantity(productId: string) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) {
        this.$store.dispatch('cart/updateQuantity', {
          productId,
          quantity: item.quantity - 1,
        });
      }
    },
    removeItem(productId: string) {
      this.$store.dispatch('cart/removeItem', productId);
    },
    checkout() {
      alert('Order placed successfully!');
      this.$store.dispatch('cart/clearCart');
      this.$router.push({ name: 'home' });
    },
  },
});
</script>

<style scoped lang="scss">
.cart-title {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
}

.cart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: var(--spacing-sm);
  }
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.cart-item-info {
  display: flex;
  flex-direction: column;
}

.cart-item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.cart-item-price {
  color: var(--color-text-light);
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.quantity-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-background-alt);
  }
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.cart-item-total {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.cart-item-remove {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-error);
    color: white;
  }
}

.cart-summary {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  height: fit-content;
  position: sticky;
  top: calc(60px + var(--spacing-md));
}

.cart-summary-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-lg);
}

.cart-summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
}

.cart-summary-value {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.cart-checkout-button {
  width: 100%;
  padding: var(--spacing-md);
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

.cart-empty {
  text-align: center;
  padding: var(--spacing-2xl);
}

.cart-continue-shopping {
  display: inline-block;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-dark);
  }
}
</style>
