/**
 * E2E Test Suite: Search Bar Banner Verification
 * 
 * Purpose:
 *   Verifies that ADUSA advertising banners appear correctly in the search dropdown
 *   when users interact with the search bar across all OPCO sites.
 * 
 * Test Coverage:
 *   - Main Suite: 7 tests verifying banner elements and behavior
 *   - Multi-OPCO Suite: 6 tests across all operating companies
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - Timeout: 10 seconds per assertion
 * 
 * @see {@link https://nonprd-delta.{opco}.com}
 */

import { test, expect } from '@playwright/test';
import { PlaywrightHomepagePage } from '../../page-objects/PlaywrightHomepagePage';
import { OPCO_CONFIGS, getAllOpcoConfigs, type OPCO, type OpcoConfig } from '../../../config/test.config';
import { time } from 'console';

// ============================================================================
// Test Configuration
// ============================================================================

const BASE_URL = process.env.TEST_BASE_URL || 'https://nonprd-delta.stopandshop.com';
const QA_USER_AGENT = 'qa-reg-(pdl)-cua/05:01; +reg/18';
const TIMEOUT = 5000;
// ============================================================================
// Multi-OPCO Test Suite: Cross-Platform Verification
// ============================================================================
test.describe('Search Bar ADUSA Banner - Multi-OPCO Verification', () => {
  // Use centralized OPCO configurations
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Check if Skinny banner on ${opco.name}`, async ({ page, context }) => {
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

      await expect(homepage.searchInput).toBeVisible({ timeout: TIMEOUT });
      await homepage.clickSearchBar();

      await page.waitForTimeout(2000);

      // Check for ADUSA banner
      const count = await homepage.getAdusaBannerCount();
      
      expect(count).toBeGreaterThan(0);
    });
  }
});
