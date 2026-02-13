/**
 * Footer Component Page Object
 */

import { VueWrapper } from '@vue/test-utils';
import BasePage from '../BasePage';

export class FooterPage extends BasePage {
  private readonly selectors = {
    footer: '[data-testid="footer"]',
    footerLinks: '[data-testid^="footer-link-"]',
    socialLinks: '[data-testid^="social-link-"]',
    newsletter: '[data-testid="newsletter-form"]',
    newsletterInput: '[data-testid="newsletter-input"]',
    newsletterButton: '[data-testid="newsletter-button"]',
    copyright: '[data-testid="copyright"]',
  };

  constructor(wrapper: VueWrapper) {
    super(wrapper);
  }

  isLoaded(): boolean {
    return this.exists(this.selectors.footer);
  }

  getFooterLinksCount(): number {
    return this.count(this.selectors.footerLinks);
  }

  async clickFooterLink(index: number): Promise<void> {
    const links = this.findAll(this.selectors.footerLinks);
    if (links[index]) {
      await links[index].trigger('click');
    }
  }

  getSocialLinksCount(): number {
    return this.count(this.selectors.socialLinks);
  }

  async subscribeNewsletter(email: string): Promise<void> {
    await this.type(this.selectors.newsletterInput, email);
    await this.click(this.selectors.newsletterButton);
  }

  getCopyrightText(): string {
    return this.getText(this.selectors.copyright);
  }
}

export default FooterPage;
