/**
 * Header Component Page Object
 * Represents the header component with navigation and cart
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from '../BasePage';

export class HeaderPage extends BasePage {
  private readonly selectors = {
    header: '[data-testid="header"]',
    logo: '[data-testid="header-logo"]',
    searchBar: '[data-testid="search-bar"]',
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]',
    cartBadge: '[data-testid="cart-badge"]',
    cartIcon: '[data-testid="cart-icon"]',
    cartCount: '[data-testid="cart-count"]',
    navMenu: '[data-testid="nav-menu"]',
    navLink: '[data-testid^="nav-link-"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  isLoaded(): boolean {
    return this.exists(this.selectors.header);
  }

  // Logo methods
  async clickLogo(): Promise<void> {
    await this.click(this.selectors.logo);
  }

  hasLogo(): boolean {
    return this.exists(this.selectors.logo);
  }

  // Search methods
  async search(query: string): Promise<void> {
    await this.type(this.selectors.searchInput, query);
    await this.click(this.selectors.searchButton);
  }

  async typeInSearch(query: string): Promise<void> {
    await this.type(this.selectors.searchInput, query);
  }

  getSearchValue(): string {
    const input = this.find(this.selectors.searchInput);
    return (input.element as HTMLInputElement).value;
  }

  hasSearchBar(): boolean {
    return this.exists(this.selectors.searchBar);
  }

  // Cart methods
  getCartCount(): number {
    const countText = this.getText(this.selectors.cartCount);
    return parseInt(countText) || 0;
  }

  hasCartBadge(): boolean {
    return this.exists(this.selectors.cartBadge);
  }

  async clickCart(): Promise<void> {
    await this.click(this.selectors.cartIcon);
  }

  // Navigation methods
  async clickNavLink(index: number): Promise<void> {
    const links = this.findAll(this.selectors.navLink);
    if (links[index]) {
      await links[index].trigger('click');
    }
  }

  getNavLinksCount(): number {
    return this.count(this.selectors.navLink);
  }

  getNavLinkText(index: number): string {
    const links = this.findAll(this.selectors.navLink);
    return links[index]?.text() || '';
  }
}

export default HeaderPage;
