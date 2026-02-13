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
import { OPCO_CONFIGS, getAllOpcoConfigs, type OPCO, type OpcoConfig } from '../../../config/test.config';

// ============================================================================
// Test Configuration
// ============================================================================

const QA_USER_AGENT = 'qa-reg-(pdl)-cua/05:01; +reg/18';
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
      // Add stealth scripts to bypass bot detection
      await context.addInitScript(() => {
        // Override the navigator.webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
        
        // Override the navigator.plugins to appear as a real browser
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
        
        // Override the navigator.languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
        
        // Add chrome property
        (window as any).chrome = {
          runtime: {},
        };
        
        // Mock permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters: any) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: 'prompt' } as PermissionStatus) :
            originalQuery(parameters)
        );
      });

      await page.setExtraHTTPHeaders({
        'User-Agent': QA_USER_AGENT
      });

      // Initialize page object
      const homepage = new PlaywrightHomepagePage(page);
      
      // Navigate to OPCO homepage
      await homepage.goto(opco.url);
      
      // Add human-like delay after navigation
      await page.waitForTimeout(1500 + Math.random() * 1000);
      
      // Complete initial setup
      await homepage.completeInitialSetup('in-store');

      // Wait for ads to load
      await page.waitForTimeout(2000);

      // Locate the Top Homepage Banner Ad
      const topBannerAd = page.locator(BANNER_SELECTOR);
      
      // Scroll to the banner to make it visible
      await topBannerAd.first().scrollIntoViewIfNeeded();
      
      // Wait a moment for any lazy loading
      await page.waitForTimeout(1000);
      
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
