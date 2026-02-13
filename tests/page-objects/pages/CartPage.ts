/**
 * Cart Page Object
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from '../BasePage';

export class CartPage extends BasePage {
  private readonly selectors = {
    cart: '[data-testid="cart"]',
    cartItems: '[data-testid^="cart-item-"]',
    cartItemName: '[data-testid="cart-item-name"]',
    cartItemPrice: '[data-testid="cart-item-price"]',
    cartItemQuantity: '[data-testid="cart-item-quantity"]',
    cartItemTotal: '[data-testid="cart-item-total"]',
    
    quantityIncrease: '[data-testid="quantity-increase"]',
    quantityDecrease: '[data-testid="quantity-decrease"]',
    removeItem: '[data-testid="remove-item"]',
    
    cartSummary: '[data-testid="cart-summary"]',
    subtotal: '[data-testid="subtotal"]',
    tax: '[data-testid="tax"]',
    shipping: '[data-testid="shipping"]',
    total: '[data-testid="total"]',
    
    checkoutBtn: '[data-testid="checkout-button"]',
    continueShoppingBtn: '[data-testid="continue-shopping"]',
    clearCartBtn: '[data-testid="clear-cart"]',
    
    emptyCart: '[data-testid="empty-cart"]',
    emptyCartMessage: '[data-testid="empty-cart-message"]',
    
    promoCodeInput: '[data-testid="promo-code-input"]',
    applyPromoBtn: '[data-testid="apply-promo"]',
    promoMessage: '[data-testid="promo-message"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  isLoaded(): boolean {
    return this.exists(this.selectors.cart);
  }

  // Cart item methods
  getCartItemsCount(): number {
    return this.count(this.selectors.cartItems);
  }

  getCartItem(index: number) {
    return this.findAll(this.selectors.cartItems)[index];
  }

  getItemName(index: number): string {
    const item = this.getCartItem(index);
    return item?.find(this.selectors.cartItemName).text() || '';
  }

  getItemPrice(index: number): string {
    const item = this.getCartItem(index);
    return item?.find(this.selectors.cartItemPrice).text() || '';
  }

  getItemQuantity(index: number): number {
    const item = this.getCartItem(index);
    const qtyText = item?.find(this.selectors.cartItemQuantity).text() || '0';
    return parseInt(qtyText);
  }

  getItemTotal(index: number): string {
    const item = this.getCartItem(index);
    return item?.find(this.selectors.cartItemTotal).text() || '';
  }

  // Quantity update methods
  async increaseItemQuantity(index: number): Promise<void> {
    const item = this.getCartItem(index);
    if (item) {
      await item.find(this.selectors.quantityIncrease).trigger('click');
    }
  }

  async decreaseItemQuantity(index: number): Promise<void> {
    const item = this.getCartItem(index);
    if (item) {
      await item.find(this.selectors.quantityDecrease).trigger('click');
    }
  }

  async removeItem(index: number): Promise<void> {
    const item = this.getCartItem(index);
    if (item) {
      await item.find(this.selectors.removeItem).trigger('click');
    }
  }

  // Cart summary methods
  getSubtotal(): string {
    return this.getText(this.selectors.subtotal);
  }

  getTax(): string {
    return this.getText(this.selectors.tax);
  }

  getShipping(): string {
    return this.getText(this.selectors.shipping);
  }

  getTotal(): string {
    return this.getText(this.selectors.total);
  }

  hasCartSummary(): boolean {
    return this.exists(this.selectors.cartSummary);
  }

  // Action methods
  async checkout(): Promise<void> {
    await this.click(this.selectors.checkoutBtn);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.selectors.continueShoppingBtn);
  }

  async clearCart(): Promise<void> {
    await this.click(this.selectors.clearCartBtn);
  }

  // Promo code methods
  async applyPromoCode(code: string): Promise<void> {
    await this.type(this.selectors.promoCodeInput, code);
    await this.click(this.selectors.applyPromoBtn);
  }

  getPromoMessage(): string {
    return this.getText(this.selectors.promoMessage);
  }

  hasPromoMessage(): boolean {
    return this.exists(this.selectors.promoMessage);
  }

  // Empty cart methods
  isEmpty(): boolean {
    return this.exists(this.selectors.emptyCart);
  }

  getEmptyCartMessage(): string {
    return this.getText(this.selectors.emptyCartMessage);
  }
}

export default CartPage;
