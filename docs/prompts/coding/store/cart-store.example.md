# cart-store.example.md

```ts
// src/store/cart.ts
import { Module } from 'vuex';
import { RootState } from './index';
import { Product } from '@/interfaces/domain';

export interface CartItem {
  id: string; name: string; price: number; quantity: number; imageUrl: string; currency: string;
}
export interface CartState { items: CartItem[] }

const state: CartState = { items: [] };

const mutations = {
  ADD_ITEM(state: CartState, product: Product) {
    if (!product || !product.id) {
      console.warn('[cart] Ignored ADD_ITEM for invalid product payload:', product);
      return;
    }
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        currency: product.currency || '$'
      });
    }
  },
  DECREMENT_ITEM(state: CartState, id: string) {
    const existing = state.items.find(i => i.id === id);
    if (!existing) return;
    existing.quantity -= 1;
    if (existing.quantity <= 0) state.items = state.items.filter(i => i.id !== id);
  },
  REMOVE_ITEM(state: CartState, id: string) { state.items = state.items.filter(i => i.id !== id); },
  CLEAR(state: CartState) { state.items = []; }
};

const actions = {
  addToCart({ commit }, product: Product) { commit('ADD_ITEM', product); },
  decrementItem({ commit }, id: string) { commit('DECREMENT_ITEM', id); },
  removeItem({ commit }, id: string) { commit('REMOVE_ITEM', id); },
  clearCart({ commit }) { commit('CLEAR'); }
};

const getters = {
  cartItems: (state: CartState): CartItem[] => state.items,
  cartCount: (state: CartState): number => state.items.reduce((s, i) => s + i.quantity, 0),
  cartSubtotal: (state: CartState): number => state.items.reduce((s, i) => s + i.price * i.quantity, 0)
};

export const cart: Module<CartState, RootState> = { namespaced: true, state, mutations, actions, getters };
export default cart;
```