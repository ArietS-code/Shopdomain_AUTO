/**
 * Product Listing Page Object
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from '../BasePage';

export class ProductListingPage extends BasePage {
  private readonly selectors = {
    productList: '[data-testid="product-list"]',
    productCard: '[data-testid^="product-card-"]',
    productName: '[data-testid="product-name"]',
    productPrice: '[data-testid="product-price"]',
    productImage: '[data-testid="product-image"]',
    productRating: '[data-testid="product-rating"]',
    addToCartBtn: '[data-testid="add-to-cart"]',
    
    filterSection: '[data-testid="filter-section"]',
    categoryFilter: '[data-testid^="category-filter-"]',
    priceFilter: '[data-testid="price-filter"]',
    ratingFilter: '[data-testid="rating-filter"]',
    clearFilters: '[data-testid="clear-filters"]',
    
    sortDropdown: '[data-testid="sort-dropdown"]',
    sortOption: '[data-testid^="sort-option-"]',
    
    pagination: '[data-testid="pagination"]',
    paginationNext: '[data-testid="pagination-next"]',
    paginationPrev: '[data-testid="pagination-prev"]',
    paginationPage: '[data-testid^="pagination-page-"]',
    
    noResults: '[data-testid="no-results"]',
    loadingSpinner: '[data-testid="loading-spinner"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  isLoaded(): boolean {
    return this.exists(this.selectors.productList);
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

  getProductRating(index: number): string {
    const product = this.getProduct(index);
    return product?.find(this.selectors.productRating).text() || '';
  }

  async clickProduct(index: number): Promise<void> {
    const products = this.findAll(this.selectors.productCard);
    if (products[index]) {
      await products[index].trigger('click');
    }
  }

  async addToCart(index: number): Promise<void> {
    const product = this.getProduct(index);
    if (product) {
      await product.find(this.selectors.addToCartBtn).trigger('click');
    }
  }

  // Filter methods
  async selectCategory(index: number): Promise<void> {
    const categories = this.findAll(this.selectors.categoryFilter);
    if (categories[index]) {
      await categories[index].trigger('click');
    }
  }

  async clearAllFilters(): Promise<void> {
    await this.click(this.selectors.clearFilters);
  }

  hasFilters(): boolean {
    return this.exists(this.selectors.filterSection);
  }

  // Sort methods
  async selectSort(index: number): Promise<void> {
    await this.click(this.selectors.sortDropdown);
    const options = this.findAll(this.selectors.sortOption);
    if (options[index]) {
      await options[index].trigger('click');
    }
  }

  // Pagination methods
  async goToNextPage(): Promise<void> {
    await this.click(this.selectors.paginationNext);
  }

  async goToPreviousPage(): Promise<void> {
    await this.click(this.selectors.paginationPrev);
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pages = this.findAll(this.selectors.paginationPage);
    const page = pages.find((p) =>
      p.text().includes(pageNumber.toString())
    );
    if (page) {
      await page.trigger('click');
    }
  }

  hasPagination(): boolean {
    return this.exists(this.selectors.pagination);
  }

  // State methods
  isLoading(): boolean {
    return this.exists(this.selectors.loadingSpinner);
  }

  hasNoResults(): boolean {
    return this.exists(this.selectors.noResults);
  }

  getNoResultsText(): string {
    return this.getText(this.selectors.noResults);
  }
}

export default ProductListingPage;
