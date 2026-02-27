/**
 * E2E Test Suite: Top Homepage Banner Ad Verification
 * 
 * Purpose:
 *   Verifies that the top homepage banner ad (display-ad-1) is displayed
 *   when the homepage loads across all OPCO sites.
 * 
 * Test Coverage:
 *   - Multi-OPCO Suite: 6 tests across all operating companies
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - Banner Selector: #display-ad-1
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
const BANNER_SELECTOR = '#display-ad-1';

// ============================================================================
// Multi-OPCO Test Suite: Top Homepage Banner Ad Verification
// ============================================================================

test.describe('Top Homepage Banner Ad - Multi-OPCO Verification', () => {
  // Use centralized OPCO configurations
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Check if Top Homepage Banner Ad is displayed on ${opco.name}`, async ({ page, context }) => {
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

      // Locate the Top Homepage Banner Ad
      const topBannerAd = page.locator(BANNER_SELECTOR);
      
      // Scroll to the banner to make it visible
      await topBannerAd.first().scrollIntoViewIfNeeded();
      
      // Wait for lazy-loaded content
      await page.waitForTimeout(1500);
      
      // Verify Top Homepage Banner Ad is displayed
      await expect(topBannerAd.first()).toBeVisible({ timeout: TIMEOUT });
      
      // Take screenshot of the banner
      const screenshotPath = `test-results/screenshots/top-homepage-banner/${opcoKey}-banner.png`;
      await topBannerAd.first().screenshot({ path: screenshotPath });
      
      // Take full page screenshot
      const fullPageScreenshotPath = `test-results/screenshots/top-homepage-banner/${opcoKey}-full-page.png`;
      await page.screenshot({ path: fullPageScreenshotPath, fullPage: true });
      
      console.log(`📸 Screenshots saved for ${opco.name}`);
    });
  }
});
