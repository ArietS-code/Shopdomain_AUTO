/**
 * Product Details Page Object
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from '../BasePage';

export class ProductDetailsPage extends BasePage {
  private readonly selectors = {
    productDetails: '[data-testid="product-details"]',
    productImage: '[data-testid="product-image"]',
    productGallery: '[data-testid^="gallery-image-"]',
    productName: '[data-testid="product-name"]',
    productPrice: '[data-testid="product-price"]',
    originalPrice: '[data-testid="original-price"]',
    productRating: '[data-testid="product-rating"]',
    productDescription: '[data-testid="product-description"]',
    
    quantityInput: '[data-testid="quantity-input"]',
    quantityIncrease: '[data-testid="quantity-increase"]',
    quantityDecrease: '[data-testid="quantity-decrease"]',
    
    addToCartBtn: '[data-testid="add-to-cart"]',
    buyNowBtn: '[data-testid="buy-now"]',
    
    badges: '[data-testid^="badge-"]',
    dealBadge: '[data-testid="deal-badge"]',
    
    specifications: '[data-testid="specifications"]',
    specItem: '[data-testid^="spec-"]',
    
    reviews: '[data-testid="reviews-section"]',
    reviewCard: '[data-testid^="review-"]',
    writeReviewBtn: '[data-testid="write-review"]',
    
    relatedProducts: '[data-testid="related-products"]',
    relatedProductCard: '[data-testid^="related-product-"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  isLoaded(): boolean {
    return this.exists(this.selectors.productDetails);
  }

  // Product info methods
  getProductName(): string {
    return this.getText(this.selectors.productName);
  }

  getProductPrice(): string {
    return this.getText(this.selectors.productPrice);
  }

  getOriginalPrice(): string | null {
    return this.exists(this.selectors.originalPrice)
      ? this.getText(this.selectors.originalPrice)
      : null;
  }

  hasDiscount(): boolean {
    return this.exists(this.selectors.originalPrice);
  }

  getProductRating(): string {
    return this.getText(this.selectors.productRating);
  }

  getProductDescription(): string {
    return this.getText(this.selectors.productDescription);
  }

  // Image gallery methods
  getGalleryImagesCount(): number {
    return this.count(this.selectors.productGallery);
  }

  async selectGalleryImage(index: number): Promise<void> {
    const images = this.findAll(this.selectors.productGallery);
    if (images[index]) {
      await images[index].trigger('click');
    }
  }

  // Quantity methods
  getQuantity(): number {
    const input = this.find(this.selectors.quantityInput);
    return parseInt((input.element as HTMLInputElement).value) || 1;
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.type(this.selectors.quantityInput, quantity.toString());
  }

  async increaseQuantity(): Promise<void> {
    await this.click(this.selectors.quantityIncrease);
  }

  async decreaseQuantity(): Promise<void> {
    await this.click(this.selectors.quantityDecrease);
  }

  // Action methods
  async addToCart(): Promise<void> {
    await this.click(this.selectors.addToCartBtn);
  }

  async buyNow(): Promise<void> {
    await this.click(this.selectors.buyNowBtn);
  }

  // Badges methods
  getBadgesCount(): number {
    return this.count(this.selectors.badges);
  }

  hasDealBadge(): boolean {
    return this.exists(this.selectors.dealBadge);
  }

  getDealBadgeText(): string {
    return this.getText(this.selectors.dealBadge);
  }

  // Specifications methods
  getSpecificationsCount(): number {
    return this.count(this.selectors.specItem);
  }

  hasSpecifications(): boolean {
    return this.exists(this.selectors.specifications);
  }

  // Reviews methods
  getReviewsCount(): number {
    return this.count(this.selectors.reviewCard);
  }

  hasReviews(): boolean {
    return this.exists(this.selectors.reviews);
  }

  async writeReview(): Promise<void> {
    await this.click(this.selectors.writeReviewBtn);
  }

  // Related products methods
  getRelatedProductsCount(): number {
    return this.count(this.selectors.relatedProductCard);
  }

  hasRelatedProducts(): boolean {
    return this.exists(this.selectors.relatedProducts);
  }

  async clickRelatedProduct(index: number): Promise<void> {
    const products = this.findAll(this.selectors.relatedProductCard);
    if (products[index]) {
      await products[index].trigger('click');
    }
  }
}

export default ProductDetailsPage;
