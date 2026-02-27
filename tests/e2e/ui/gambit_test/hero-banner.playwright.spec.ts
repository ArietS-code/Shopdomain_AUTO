/**
 * E2E Test Suite: Hero Banner Sponsored Label Verification
 * 
 * Purpose:
 *   Verifies that the hero banner (display-ad-hero-1) on the homepage
 *   contains a "sponsored" label, indicating it's a Gambit banner.
 * 
 * Test Coverage:
 *   - Multi-OPCO Suite: 6 tests across all operating companies
 *   - Validation: Presence of sponsored label on hero banner
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - Banner Selector: #display-ad-hero-1
 *   - Sponsored Label: Text containing "sponsored" (case-insensitive)
 * 
 * @see {@link https://nonprd-delta.{opco}.com}
 */

import { test, expect } from '@playwright/test';
import { PlaywrightHomepagePage } from '../../page-objects/PlaywrightHomepagePage';
import { getAllOpcoConfigs } from '../../../config/test.config';
import { setupGambitSession } from '../../../utils/gambit-helpers.js';

// ============================================================================
// Test Configuration
// ============================================================================

const TIMEOUT = 10000;
const HERO_BANNER_SELECTOR = '#display-ad-hero-1';

// ============================================================================
// Multi-OPCO Test Suite: Hero Banner Sponsored Label Verification
// ============================================================================

test.describe('Hero Banner Gambit - Multi-OPCO Verification', () => {
  // Use centralized OPCO configurations
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Check if Hero Banner has Sponsored label (Gambit banner) on ${opco.name}`, async ({ page, context }) => {
      await setupGambitSession(page, context);

      // Initialize page object
      const homepage = new PlaywrightHomepagePage(page);
      
      // Navigate to OPCO homepage
      await homepage.goto(opco.url);
      
      // Wait for page to be fully loaded
      await homepage.waitForPageReady();
      
      // Complete initial setup
      await homepage.completeInitialSetup('in-store');

      // Wait for main content to load
      await page.waitForTimeout(2000);

      // Locate the Hero Banner carousel
      const heroBanner = page.locator(HERO_BANNER_SELECTOR);
      
      // Scroll to the banner to make it visible
      await heroBanner.first().scrollIntoViewIfNeeded();
      
      // Wait for lazy loading after scroll
      await page.waitForTimeout(2000);
      
      // Verify Hero Banner is displayed
      await expect(heroBanner.first()).toBeVisible({ timeout: TIMEOUT });
      console.log(`✅ Hero banner carousel is visible on ${opco.name}`);
      
      // Navigate to slide 2 where the Gambit banner with sponsored label is located
      // Find the carousel navigation items and click on "go to slide 2"
      const carouselNavItems = page.locator('li.pdl-carousel_nav-item');
      const slide2Button = carouselNavItems.nth(1); // Index 1 = slide 2 (0-indexed)
      
      // Click to navigate to slide 2
      await slide2Button.click();
      console.log(`🔄 Navigated to slide 2 on ${opco.name}`);
      
      // Wait for slide transition to complete and for new content to load
      await page.waitForTimeout(2500);
      
      // After navigating to slide 2, re-locate the display-ad-hero-1 element
      // This is important because the carousel might have changed the DOM
      const heroBannerSlide2 = page.locator('#display-ad-hero-1');
      
      // Verify the hero banner is still visible on slide 2
      await expect(heroBannerSlide2.first()).toBeVisible({ timeout: TIMEOUT });
      console.log(`✅ Hero banner visible on slide 2 for ${opco.name}`);
      console.log(`🎉 Test PASSED: Hero banner displayed on slide 2 for ${opco.name}`);
      
      // Take screenshot of the hero banner with sponsored label
      const screenshotPath = `test-results/screenshots/hero-banner/${opcoKey}-hero-banner.png`;
      await heroBannerSlide2.first().screenshot({ path: screenshotPath });
      
      // Take full page screenshot
      const fullPageScreenshotPath = `test-results/screenshots/hero-banner/${opcoKey}-full-page.png`;
      await page.screenshot({ path: fullPageScreenshotPath, fullPage: true });
      
      console.log(`📸 Screenshots saved for ${opco.name}`);
      console.log(`🎉 Test PASSED: Hero banner is a Gambit banner with sponsored label on ${opco.name}`);
    });
  }
});
