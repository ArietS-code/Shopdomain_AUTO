/**
 * Base Page Object
 * Contains common functionality for all page objects
 */

import { VueWrapper } from '@vue/test-utils';
import { waitForElement, waitFor } from '../utils/test-helpers';

export abstract class BasePage {
  protected wrapper: VueWrapper;

  constructor(wrapper: VueWrapper) {
    this.wrapper = wrapper;
  }

  /**
   * Find element by selector
   */
  protected find(selector: string) {
    return this.wrapper.find(selector);
  }

  /**
   * Find all elements by selector
   */
  protected findAll(selector: string) {
    return this.wrapper.findAll(selector);
  }

  /**
   * Find element by test id
   */
  protected findByTestId(testId: string) {
    return this.wrapper.find(`[data-testid="${testId}"]`);
  }

  /**
   * Find all elements by test id pattern
   */
  protected findAllByTestId(testId: string) {
    return this.wrapper.findAll(`[data-testid^="${testId}"]`);
  }

  /**
   * Check if element exists
   */
  protected exists(selector: string): boolean {
    return this.find(selector).exists();
  }

  /**
   * Check if element is visible
   */
  protected isVisible(selector: string): boolean {
    const element = this.find(selector);
    return element.exists() && element.isVisible();
  }

  /**
   * Get element text
   */
  protected getText(selector: string): string {
    return this.find(selector).text();
  }

  /**
   * Get all element texts
   */
  protected getAllTexts(selector: string): string[] {
    return this.findAll(selector).map((el) => el.text());
  }

  /**
   * Click element
   */
  protected async click(selector: string): Promise<void> {
    await this.find(selector).trigger('click');
  }

  /**
   * Type into input
   */
  protected async type(selector: string, text: string): Promise<void> {
    const input = this.find(selector);
    await input.setValue(text);
  }

  /**
   * Wait for element to appear
   */
  protected async waitForElement(
    selector: string,
    timeout = 5000
  ): Promise<void> {
    await waitForElement(this.wrapper, selector, timeout);
  }

  /**
   * Wait for element to disappear
   */
  protected async waitForElementToDisappear(
    selector: string,
    timeout = 5000
  ): Promise<void> {
    await waitFor(() => !this.exists(selector), timeout);
  }

  /**
   * Wait for text to appear
   */
  protected async waitForText(
    selector: string,
    text: string,
    timeout = 5000
  ): Promise<void> {
    await waitFor(() => this.getText(selector).includes(text), timeout);
  }

  /**
   * Get element attribute
   */
  protected getAttribute(selector: string, attr: string): string | undefined {
    return this.find(selector).attributes(attr);
  }

  /**
   * Check if element has class
   */
  protected hasClass(selector: string, className: string): boolean {
    return this.find(selector).classes().includes(className);
  }

  /**
   * Count elements
   */
  protected count(selector: string): number {
    return this.findAll(selector).length;
  }

  /**
   * Get element by text content
   */
  protected findByText(text: string) {
    return this.wrapper
      .findAll('*')
      .filter((el) => el.text().trim() === text)[0];
  }

  /**
   * Scroll to element (simulate)
   */
  protected async scrollTo(selector: string): Promise<void> {
    const element = this.find(selector);
    if (element.exists()) {
      element.element.scrollIntoView();
    }
  }

  /**
   * Take screenshot of component (placeholder - would need integration)
   */
  protected async screenshot(name: string): Promise<void> {
    // Placeholder for screenshot functionality
    console.log(`Screenshot: ${name}`);
  }

  /**
   * Get HTML content
   */
  protected getHtml(): string {
    return this.wrapper.html();
  }

  /**
   * Check if page is loaded (override in subclasses)
   */
  abstract isLoaded(): boolean;
}

export default BasePage;
