import type { Module } from 'vuex';
import type { Product } from '@/interfaces/domain';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const cart: Module<CartState, any> = {
  namespaced: true,
  state: (): CartState => ({
    items: [],
  }),
  mutations: {
    ADD_ITEM(state, product: Product) {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
    },
    REMOVE_ITEM(state, productId: string) {
      state.items = state.items.filter((item) => item.product.id !== productId);
    },
    UPDATE_QUANTITY(state, { productId, quantity }: { productId: string; quantity: number }) {
      const item = state.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((item) => item.product.id !== productId);
        }
      }
    },
    CLEAR_CART(state) {
      state.items = [];
    },
  },
  actions: {
    addItem({ commit }, product: Product) {
      commit('ADD_ITEM', product);
    },
    removeItem({ commit }, productId: string) {
      commit('REMOVE_ITEM', productId);
    },
    updateQuantity({ commit }, payload: { productId: string; quantity: number }) {
      commit('UPDATE_QUANTITY', payload);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
  },
  getters: {
    items: (state): CartItem[] => state.items,
    itemCount: (state): number => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state): number =>
      state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    isEmpty: (state): boolean => state.items.length === 0,
  },
};

export default cart;
