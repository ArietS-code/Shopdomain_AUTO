/**
 * Homepage Page Object
 * Represents the homepage view with all its elements and interactions
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from './BasePage';

export class HomepagePage extends BasePage {
  // Selectors
  private readonly selectors = {
    // Search
    searchInput: '#typeahead-search-input',
    
    // Skinny Banner (Adhese Ad)
    skinnyBanner: 'a[href="https://ads-adusatest.adhese.com/raylene"]',
    
    carousel: '[data-testid="homepage-carousel"]',
    carouselSlide: '[data-testid^="carousel-slide-"]',
    carouselNext: '[data-testid="carousel-next"]',
    carouselPrev: '[data-testid="carousel-prev"]',
    carouselDots: '[data-testid^="carousel-dot-"]',
    
    promotionBanner: '[data-testid="promotion-banner"]',
    promotionCta: '[data-testid="promotion-cta"]',
    
    dealSection: '[data-testid="deals-section"]',
    dealCards: '[data-testid^="deal-card-"]',
    dealBadge: '[data-testid="deal-badge"]',
    
    categoryGrid: '[data-testid="category-grid"]',
    categoryCard: '[data-testid^="category-card-"]',
    
    productCard: '[data-testid^="product-card-"]',
    productImage: '[data-testid="product-image"]',
    productName: '[data-testid="product-name"]',
    productPrice: '[data-testid="product-price"]',
    addToCartBtn: '[data-testid="add-to-cart"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  /**
   * Check if homepage is loaded
   */
  isLoaded(): boolean {
    return this.exists(this.selectors.carousel);
  }

  // Search methods
  async clickSearchBar(): Promise<void> {
    await this.click(this.selectors.searchInput);
  }
    click(searchInput: string) {
        throw new Error('Method not implemented.');
    }

  async typeInSearch(text: string): Promise<void> {
    await this.type(this.selectors.searchInput, text);
  }

  // Skinny Banner methods
  hasSkinnyBanner(): boolean {
    return this.exists(this.selectors.skinnyBanner);
  }

  getSkinnyBannerCount(): number {
    return this.count(this.selectors.skinnyBanner);
  }

  getSkinnyBannerHref(): string {
    const banner = this.find(this.selectors.skinnyBanner);
    return banner?.attributes('href') || '';
  }

  async clickSkinnyBanner(): Promise<void> {
    await this.click(this.selectors.skinnyBanner);
  }

  // Carousel methods
  async nextSlide(): Promise<void> {
    await this.click(this.selectors.carouselNext);
  }

  async previousSlide(): Promise<void> {
    await this.click(this.selectors.carouselPrev);
  }

  async goToSlide(index: number): Promise<void> {
    const dots = this.findAll(this.selectors.carouselDots);
    if (dots[index]) {
      await dots[index].trigger('click');
    }
  }

  getActiveSlideIndex(): number {
    const dots = this.findAll(this.selectors.carouselDots);
    return dots.findIndex((dot) => dot.classes().includes('active'));
  }

  getCarouselSlidesCount(): number {
    return this.count(this.selectors.carouselSlide);
  }

  // Promotion methods
  hasPromotionBanner(): boolean {
    return this.exists(this.selectors.promotionBanner);
  }

  getPromotionText(): string {
    return this.getText(this.selectors.promotionBanner);
  }

  async clickPromotionCta(): Promise<void> {
    await this.click(this.selectors.promotionCta);
  }

  // Deals section methods
  getDealsCount(): number {
    return this.count(this.selectors.dealCards);
  }

  getDealCard(index: number) {
    return this.findAll(this.selectors.dealCards)[index];
  }

  hasDealBadge(index: number): boolean {
    const card = this.getDealCard(index);
    return card?.find(this.selectors.dealBadge).exists() || false;
  }

  getDealDiscount(index: number): string {
    const card = this.getDealCard(index);
    return card?.find(this.selectors.dealBadge).text() || '';
  }

  // Category grid methods
  getCategoriesCount(): number {
    return this.count(this.selectors.categoryCard);
  }

  async clickCategory(index: number): Promise<void> {
    const categories = this.findAll(this.selectors.categoryCard);
    if (categories[index]) {
      await categories[index].trigger('click');
    }
  }

  getCategoryName(index: number): string {
    const categories = this.findAll(this.selectors.categoryCard);
    return categories[index]?.text() || '';
  }

  // Product methods
  getProductsCount(): number {
    return this.count(this.selectors.productCard);
  }

  getProduct(index: number) {
    return this.findAll(this.selectors.productCard)[index];
  }

  getProductName(index: number): string {
    const product = this.getProduct(index);
    return product?.find(this.selectors.productName).text() || '';
  }

  getProductPrice(index: number): string {
    const product = this.getProduct(index);
    return product?.find(this.selectors.productPrice).text() || '';
  }

  async clickProduct(index: number): Promise<void> {
    const products = this.findAll(this.selectors.productCard);
    if (products[index]) {
      await products[index].trigger('click');
    }
  }

  async addProductToCart(index: number): Promise<void> {
    const product = this.getProduct(index);
    if (product) {
      await product.find(this.selectors.addToCartBtn).trigger('click');
    }
  }

  // Search and filter
  async scrollToDeals(): Promise<void> {
    await this.scrollTo(this.selectors.dealSection);
  }

  async scrollToCategories(): Promise<void> {
    await this.scrollTo(this.selectors.categoryGrid);
  }
}

export default HomepagePage;
