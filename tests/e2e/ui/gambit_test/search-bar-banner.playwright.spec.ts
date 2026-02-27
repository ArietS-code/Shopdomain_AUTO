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
import { getAllOpcoConfigs } from '../../../config/test.config';
import { setupGambitSession } from '../../../utils/gambit-helpers.js';

// ============================================================================
// Test Configuration
// ============================================================================

const BASE_URL = process.env.TEST_BASE_URL || 'https://nonprd-delta.stopandshop.com';
const TIMEOUT = 5000;
// ============================================================================
// Multi-OPCO Test Suite: Cross-Platform Verification
// ============================================================================
test.describe('Search Bar ADUSA Banner - Multi-OPCO Verification', () => {
  // Use centralized OPCO configurations
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Check if Skinny banner on ${opco.name}`, async ({ page, context }) => {
      await setupGambitSession(page, context);

      // Initialize page object
      const homepage = new PlaywrightHomepagePage(page);
      
      // Navigate to OPCO homepage
      await homepage.goto(opco.url);
      
      // Wait for page to be fully loaded
      await homepage.waitForPageReady();
      
      // Complete initial setup
      await homepage.completeInitialSetup('in-store');

      await expect(homepage.searchInput).toBeVisible({ timeout: 15000 });
      await homepage.clickSearchBar();

      // Wait for dropdown to load
      await page.waitForTimeout(2000);

      // Check for ADUSA banner
      const count = await homepage.getAdusaBannerCount();
      
      expect(count).toBeGreaterThan(0);
    });
  }
});
