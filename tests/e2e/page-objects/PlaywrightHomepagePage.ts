/**
 * Playwright Page Object: Homepage
 * 
 * Page object for homepage interactions in Playwright E2E tests
 */

import { Page, Locator } from '@playwright/test';

export class PlaywrightHomepagePage {
  readonly page: Page;
  
  // Locators
  readonly searchInput: Locator;
  readonly skinnyBanner: Locator;
  
  // ADUSA banner elements
  readonly adusaBannerText: Locator;
  readonly getCouponButton: Locator;
  readonly sponsoredLabel: Locator;
  
  // Shopping method modal
  readonly shoppingMethodModal: Locator;
  readonly inStoreOption: Locator;
  readonly pickupOption: Locator;
  readonly deliveryOption: Locator;
  
  // Store selection
  readonly notYourStorePopup: Locator;
  
  readonly carousel: Locator;
  readonly promotionBanner: Locator;
  readonly dealSection: Locator;
  readonly categoryGrid: Locator;
  
  // Gambit banner elements
  readonly smallTilesList: Locator;
  readonly largeTileCarousel: Locator;
  readonly heroBannerCarousel: Locator;
  readonly topHomepageBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.searchInput = page.locator('#typeahead-search-input');
    this.skinnyBanner = page.locator('[href="https://ads-adusatest.adhese.com/raylene"]');
    
    // Generic ADUSA banner selectors that work across all OPCOs
    // Look for any sponsored/ad elements in the search dropdown
    this.adusaBannerText = page.locator('[class*="ad-"], [class*="banner"], [data-ad], img[src*="ad"]').first();
    this.getCouponButton = page.locator('text=/coupon/i').first();
    this.sponsoredLabel = page.locator('text=/sponsored/i').first();
    
    // Shopping method modal selectors - more flexible to handle different OPCOs
    this.shoppingMethodModal = page.locator('text=/How are you shopping|Select shopping method|Choose your shopping/i');
    this.inStoreOption = page.getByRole('button', { name: /in.?store|shop in store/i });
    this.pickupOption = page.getByRole('button', { name: /pickup|pick.?up/i });
    this.deliveryOption = page.getByRole('button', { name: /delivery|deliver/i });
    
    // Store selection
    this.notYourStorePopup = page.locator('h3.text--base-strong:has-text("Not your store?")');
    
    this.carousel = page.locator('[data-testid="homepage-carousel"]');
    this.promotionBanner = page.locator('[data-testid="promotion-banner"]');
    this.dealSection = page.locator('[data-testid="deals-section"]');
    this.categoryGrid = page.locator('[data-testid="category-grid"]');
    
    // Gambit banner locators
    this.smallTilesList = page.locator('ul[class*="simple-tile-list"]').first();
    this.largeTileCarousel = page.locator('[class*="large-tile-carousel"]').first();
    this.heroBannerCarousel = page.locator('#display-ad-hero-1');
    this.topHomepageBanner = page.locator('#display-ad-1');
  }

  // Smart wait helper - waits for page to load and DOM to be ready
  async waitForPageReady(timeout: number = 30000) {
    await this.page.waitForLoadState('load', { timeout });
    await this.page.waitForLoadState('domcontentloaded', { timeout });
    // Small delay for dynamic content to start loading
    await this.page.waitForTimeout(500);
  }

  // Wait for element to be ready for interaction
  async waitForElement(locator: Locator, options: { timeout?: number; state?: 'visible' | 'attached' | 'hidden' } = {}) {
    const timeout = options.timeout || 10000;
    const state = options.state || 'visible';
    await locator.waitFor({ state, timeout });
    return locator;
  }

  // Navigation
  async goto(url: string) {
    // Navigate and wait for load event (not networkidle - too strict for ad-heavy pages)
    await this.page.goto(url, { 
      waitUntil: 'load',
      timeout: 60000 // Increased for slower OPCOs
    });
    
    // Add small random delay to appear more human
    await this.page.waitForTimeout(100 + Math.random() * 100);
    
    // Check if we hit the blocking page
    const blockingText = await this.page.locator('text=/Access is temporarily restricted/i').isVisible({ timeout: 1000 }).catch(() => false);
    
    if (blockingText) {
      //console.log('⚠️  Detected blocking page, waiting and retrying...');
      await this.page.waitForTimeout(2000);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
  }

  // Shopping method selection
  async selectShoppingMethod(method: 'in-store' | 'pickup' | 'delivery' = 'in-store') {
    try {
     // console.log(`🛒 Attempting to select shopping method: ${method}`);
      
      // Wait for page to stabilize
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(500);
      
      // Wait for shopping method modal to appear (short timeout - may not exist on all OPCOs)
      const isModalVisible = await this.shoppingMethodModal.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!isModalVisible) {
       // console.log('ℹ️  Shopping method modal not found - skipping selection');
        return;
      }
      
     // console.log('✅ Shopping method modal found');
      
      // Select the shopping method with retry logic
      const maxRetries = 2;
      for (let i = 0; i < maxRetries; i++) {
        try {
          let button: Locator;
          let buttonName: string;
          
          switch (method) {
            case 'in-store':
              button = this.inStoreOption;
              buttonName = 'In-Store';
              break;
            case 'pickup':
              button = this.pickupOption;
              buttonName = 'Pickup';
              break;
            case 'delivery':
              button = this.deliveryOption;
              buttonName = 'Delivery';
              break;
          }
          
         // console.log(`🔍 Looking for ${buttonName} button...`);
          
          // Wait for button to be available
          await button.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
          
          // Check if button is visible
          const isButtonVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
          
          if (!isButtonVisible) {
            // console.log(`⚠️  ${buttonName} button not visible, trying alternative selectors...`);
            
            // Try alternative selectors as fallback
            const alternativeButtons = [
              this.page.locator(`button:has-text("${buttonName}")`),
              this.page.locator(`button:has-text("In Store")`), // Common alternative
              this.page.locator(`[data-testid*="${method}"]`),
              this.page.locator(`button:text-is("${buttonName}")`)
            ];
            
            for (const altButton of alternativeButtons) {
              const isAltVisible = await altButton.isVisible({ timeout: 500 }).catch(() => false);
              if (isAltVisible) {
                console.log(`✅ Found button using alternative selector`);
                await altButton.click({ timeout: 2000 });
                console.log('✅ Shopping method clicked successfully');
                break;
              }
            }
          } else {
            console.log(`✅ ${buttonName} button is visible, clicking...`);
            await button.click({ timeout: 2000 });
            console.log('✅ Shopping method clicked successfully');
          }
          
          // Wait for modal to close
          await this.shoppingMethodModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          
          // Wait for modal overlay to fully disappear
          const modalOverlay = this.page.locator('.modal_overlay, .modal-overlay, [class*="modal"][class*="overlay"], .modal_header');
          await modalOverlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          
          // Additional wait for page to stabilize after modal closes
          await this.page.waitForTimeout(1000);
          console.log('✅ Shopping method selection completed');
          return; // Success, exit
          
        } catch (error) {
          console.log(`⚠️  Attempt ${i + 1} failed:`, error);
          if (i === maxRetries - 1) {
            console.log(`⚠️  Could not select shopping method after ${maxRetries} attempts, continuing anyway...`);
            return;
          }
          await this.page.waitForTimeout(500);
        }
      }
    } catch (error) {
      console.log('⚠️  Shopping method selection failed, continuing anyway');
    }
  }

  // Close "Not your store?" popup
  async closeNotYourStorePopup() {
    // Wait for any modals to settle
    await this.page.waitForTimeout(300);
    
    // Try to find and close the modal
    const closeButton = this.page.locator('button[aria-label="Close"], button.close, .modal__close, [data-testid="close-modal"]');
    const isCloseButtonVisible = await closeButton.first().isVisible({ timeout: 1000 }).catch(() => false);
    
    if (isCloseButtonVisible) {
      await closeButton.first().click();
      await this.page.waitForTimeout(300);
    } else {
      // Try pressing Escape to close modal
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    }
    
    // Wait for modal overlay to disappear
    const modalOverlay = this.page.locator('.modal_overlay, .modal-overlay');
    await modalOverlay.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    
    // Additional wait to ensure all modals are closed
    await this.page.waitForTimeout(300);
  }

  /**
   * Close Welcome Popup (appears on some OPCOs like Food Lion, Hannaford)
   * Handles various welcome modal formats with close buttons
   */
  async closeWelcomePopup() {
    try {
      // Wait for page to stabilize
      await this.page.waitForTimeout(500);
      
      console.log('🔍 Checking for welcome popup...');
      
      // Multiple selectors for different OPCO welcome popups
      const welcomeSelectors = [
        'text=/Welcome to Food Lion/i',
        'text=/Welcome!/i',
        'text=/Meet the new.*Website/i',
        'text=/A fresh way to shop/i',
        '[class*="welcome"]',
        '[class*="Welcome"]',
        '[aria-label*="Welcome"]'
      ];
      
      // Check if any welcome popup is visible
      let welcomePopupFound = false;
      for (const selector of welcomeSelectors) {
        const isVisible = await this.page.locator(selector).isVisible({ timeout: 1000 }).catch(() => false);
        if (isVisible) {
          welcomePopupFound = true;
          console.log('👋 Welcome popup detected!');
          break;
        }
      }
      
      if (welcomePopupFound) {
        // Priority: Look for X button specifically (especially for Hannaford Welcome modal)
        const closeButtonSelectors = [
          'text=/Welcome!/i >> xpath=../.. >> button:has-text("×")', // X button in Welcome modal header
          '[class*="modal"] button:has-text("×"):visible', // X button in any modal
          'button[aria-label*="Close"]:visible',
          'button[aria-label="Close"]',
          'button.close:visible',
          'button:has-text("×"):visible',
          '[data-testid="close-button"]:visible',
          '[data-testid="close-modal"]:visible',
          '.modal__close:visible',
          'button[class*="close"]:visible',
          '[role="button"][aria-label*="Close"]',
          'svg[class*="close"] >> xpath=..' // Close icon with parent button
        ];
        
        for (const selector of closeButtonSelectors) {
          try {
            const closeButton = this.page.locator(selector).first();
            const isVisible = await closeButton.isVisible({ timeout: 1000 }).catch(() => false);
            
            if (isVisible) {
              console.log(`✅ Found close button with selector: ${selector}`);
              await closeButton.click({ timeout: 2000 });
              console.log('✅ Welcome popup closed successfully');
              await this.page.waitForTimeout(500);
              return;
            }
          } catch (error) {
            continue;
          }
        }
        
        // Fallback: Try Escape key
        console.log('⌨️  Trying Escape key to close welcome popup');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      } else {
        console.log('ℹ️  No welcome popup found');
      }
    } catch (error) {
      console.log('⚠️  Error handling welcome popup:', error);
    }
  }

  /**
   * Wait for and handle device verification modal if it appears
   * Some OPCOs show "Verifying your browser" or similar security checks
   */
  async waitForDeviceVerification() {
    try {
      console.log('🔍 Checking for device verification...');
      
      const verificationSelectors = [
        'text=/Verifying your browser/i',
        'text=/Checking your browser/i',
        'text=/Just a moment/i',
        'text=/Security check/i',
        '[class*="verification"]',
        '[class*="challenge"]'
      ];
      
      // Check if verification modal appears
      for (const selector of verificationSelectors) {
        const isVisible = await this.page.locator(selector).isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          console.log('⏳ Device verification detected, waiting for completion...');
          
          // Wait for verification to complete (up to 8 seconds)
          await this.page.waitForTimeout(1000);
          
          // Wait for verification modal to disappear
          const verificationGone = await this.page.locator(selector).isHidden({ timeout: 6000 }).catch(() => true);
          
          if (verificationGone) {
            console.log('✅ Device verification completed');
            await this.page.waitForTimeout(500);
          } else {
            console.log('⚠️  Verification timeout, continuing anyway');
          }
          return;
        }
      }
      
      console.log('ℹ️  No device verification detected');
    } catch (error) {
      console.log('⚠️  Error handling device verification:', error);
    }
  }

  // Ensure no modals are blocking the page
  async ensureNoModalsOpen() {
    console.log('🔍 Checking for any remaining modals...');
    
    try {
      // Wait for page to stabilize
      await this.page.waitForTimeout(500);
      
      // Check for common modal elements
      const modalSelectors = [
        '.modal_overlay',
        '.modal-overlay', 
        '[class*="modal"][class*="overlay"]',
        '.modal_header',
        '[role="dialog"]',
        '[class*="Modal"]'
      ];
      
      for (const selector of modalSelectors) {
        const modal = this.page.locator(selector).first();
        const isVisible = await modal.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          console.log(`⚠️  Found blocking modal: ${selector}`);
          
          // Try to close it
          const closeButtons = modal.locator('button[aria-label*="Close"], button.close, [data-testid="close"]');
          const closeButtonCount = await closeButtons.count();
          
          if (closeButtonCount > 0) {
            console.log('🔘 Clicking close button...');
            await closeButtons.first().click({ timeout: 2000 }).catch(() => {});
            await this.page.waitForTimeout(500);
          } else {
            // Try pressing Escape
            console.log('⌨️  Pressing Escape to close modal...');
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
          }
        }
      }
      
      console.log('✅ No blocking modals found');
    } catch (error) {
      console.log('⚠️  Error checking for modals:', error);
    }
  }

  // Complete initial setup (welcome popup + shopping method + store popup)
  async completeInitialSetup(shoppingMethod: 'in-store' | 'pickup' | 'delivery' = 'in-store') {
    console.log('🚀 Starting initial setup...');
    
    // Step 1: Wait for device verification if present
    await this.waitForDeviceVerification();
    
    // Step 2: Close welcome popup (Food Lion, Hannaford)
    await this.closeWelcomePopup();
    
    // Step 3: Select shopping method
    await this.selectShoppingMethod(shoppingMethod);
    
    // Step 4: Close store selection popup
    await this.closeNotYourStorePopup();
    
    // Step 5: Final check - ensure no modals are blocking
    await this.ensureNoModalsOpen();
    
    console.log('✅ Initial setup complete');
  }

  // Gambit banner helper methods
  
  /**
   * Get all small tiles from the homepage
   * @returns Array of Locator objects for each small tile
   */
  async getSmallTiles() {
    await this.page.evaluate(() => window.scrollBy(0, 300));
    await this.page.waitForTimeout(1500);
    await this.smallTilesList.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return await this.smallTilesList.locator('li').all();
  }

  /**
   * Get a specific small tile by position (1-indexed)
   * @param position - Position of the tile (1, 2, 3, etc.)
   */
  getSmallTileByPosition(position: number) {
    return this.page.locator(`(//ul[contains(@class,"simple-tile-list")]//li)[${position}]`);
  }

  /**
   * Get all large tiles from the homepage carousel
   * Scrolls down progressively until large tiles carousel is found
   * @returns Array of Locator objects for each large tile
   */
  async getLargeTiles() {
    console.log('🔄 Scrolling to find large tiles...');
    
    let largeTilesFound = false;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;
    const scrollIncrement = 500; // pixels per scroll
    
    // Progressive scroll until large tiles carousel is found
    while (!largeTilesFound && scrollAttempts < maxScrollAttempts) {
      // Scroll down
      await this.page.evaluate((increment) => window.scrollBy(0, increment), scrollIncrement);
      await this.page.waitForTimeout(500);
      
      // Check if large tiles carousel is visible
      const isVisible = await this.largeTileCarousel.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isVisible) {
        console.log(`✅ Large tiles carousel found after ${scrollAttempts + 1} scroll(s)`);
        largeTilesFound = true;
      } else {
        scrollAttempts++;
        console.log(`⏳ Large tiles not found, scrolling... (attempt ${scrollAttempts})`);
      }
    }
    
    if (!largeTilesFound) {
      console.log(`⚠️ Large tiles carousel not found after ${maxScrollAttempts} scroll attempts`);
      return [];
    }
    
    // Wait for carousel to be stable
    await this.page.waitForTimeout(1000);
    
    // Get all carousel items (large tiles) - try multiple selectors
    let items = await this.largeTileCarousel.locator('[class*="large-tile-carousel_carousel_item"]').all();
    
    if (items.length === 0) {
      console.log('⚠️ No tiles found with large-tile-carousel_carousel_item selector, trying alternative...');
      items = await this.largeTileCarousel.locator('.pdl-carousel_item').all();
    }
    
    if (items.length === 0) {
      console.log('⚠️ No tiles found with pdl-carousel_item selector, trying generic li elements...');
      items = await this.largeTileCarousel.locator('li').all();
    }
    
    if (items.length === 0) {
      console.log('⚠️ No tiles found with li selector, trying div elements...');
      items = await this.largeTileCarousel.locator('div[class*="carousel"]').all();
    }
    
    console.log(`📊 Total large tiles found: ${items.length}`);
    return items;
  }

  /**
   * Check if a tile element has a "Sponsored" label
   * @param tile - Locator for the tile element
   */
  async isTileSponsored(tile: Locator): Promise<boolean> {
    const text = await tile.textContent().catch(() => '');
    return text?.includes('Sponsored') ?? false;
  }

  // Search methods
  async clickSearchBar(options: { force?: boolean } = {}) {
    try {
      // Try normal click first
      await this.searchInput.click({ timeout: 10000 });
    } catch (error) {
      console.log('⚠️  Normal click failed, attempting force click...');
      // If normal click fails due to modal, force click
      await this.searchInput.click({ force: true, timeout: 5000 });
    }
  }

  async typeInSearch(text: string) {
    await this.searchInput.fill(text);
  }

  async isSearchBarVisible() {
    return await this.searchInput.isVisible();
  }

  // Skinny Banner methods
  async isSkinnyBannerVisible() {
    return await this.skinnyBanner.first().isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getSkinnyBannerCount() {
    return await this.skinnyBanner.count();
  }

  async getSkinnyBannerHref() {
    return await this.skinnyBanner.first().getAttribute('href');
  }

  async clickSkinnyBanner() {
    await this.skinnyBanner.first().click();
  }

  async waitForSkinnyBanner(timeout: number = 10000) {
    await this.skinnyBanner.first().waitFor({ state: 'visible', timeout });
  }

  // ADUSA Banner methods
  async isAdusaBannerVisible() {
    return await this.adusaBannerText.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getAdusaBannerCount() {
    return await this.adusaBannerText.count();
  }

  async getAdusaBannerText() {
    return await this.adusaBannerText.textContent();
  }

  async isGetCouponButtonVisible() {
    return await this.getCouponButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isSponsoredLabelVisible() {
    return await this.sponsoredLabel.isVisible({ timeout: 5000 }).catch(() => false);
  }

  // Wait for page elements
  async waitForPageLoad() {
    await this.page.waitForLoadState('load');
  }

  // Screenshot utility with timestamp
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results/screenshots/${name}_${timestamp}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    return filename;
  }
}
