/**
 * E2E Test Suite: Search Result Page Gambit Banner API Validation
 * 
 * Purpose:
 *   Validates that Gambit banners appear in search results by intercepting
 *   and validating the /json API response for banner slot names.
 * 
 * Test Coverage:
 *   - Multi-OPCO Suite: 6 tests across all operating companies
 *   - API Validation: Checks for gambit banner slot names in JSON response
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - Search Keywords: eggs, cola, icecream, chips, soda
 *   - Expected Slot Names: 
 *     - {opco}.com_website_search_1-flex
 *     - {opco}.com_website_search_2-flex
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

const TIMEOUT = 1000;

// Search keywords for testing
const SEARCH_KEYWORDS = ['eggs', 'cola', 'icecream', 'chips', 'soda'];
const DEFAULT_SEARCH_KEYWORD = 'cola'; // Default keyword for most tests

// ============================================================================
// Multi-OPCO Test Suite: Search Result Banner API Validation
// ============================================================================

test.describe('Search Result Gambit Banner - Multi-OPCO API Validation', () => {
  // Use centralized OPCO configurations
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Validate Gambit banner slot names in /json response for search "${DEFAULT_SEARCH_KEYWORD}" on ${opco.name}`, async ({ page, context }) => {
      await setupGambitSession(page, context);

      // Array to store intercepted JSON responses
      let jsonResponses: any[] = [];

      // Set up request interception to capture /json API calls
      await page.route('**/json', async (route) => {
        const response = await route.fetch();
        const responseBody = await response.json();
        jsonResponses.push(responseBody);
        console.log(`📡 Intercepted /json API call on ${opco.name}`);
        route.fulfill({ response });
      });

      // Initialize page object
      const homepage = new PlaywrightHomepagePage(page);
      
      // Navigate to OPCO homepage
      await homepage.goto(opco.url);
      
      // Add human-like delay after navigation
      await page.waitForTimeout(1000 + Math.random() * 500);
      
      // Complete initial setup
      await homepage.completeInitialSetup('in-store');

      // Wait for page to be fully loaded
      await page.waitForTimeout(1000);

      console.log(`🔍 Searching for "${DEFAULT_SEARCH_KEYWORD}" on ${opco.name}`);

      // Click on search bar to open search dropdown
      await homepage.clickSearchBar();
      await page.waitForTimeout(500);

      // Type search keyword in the search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
      await searchInput.fill(DEFAULT_SEARCH_KEYWORD);
      await page.waitForTimeout(1000);

      // Press Enter or click search button to trigger search
      await searchInput.press('Enter');
      
      console.log(`⏳ Waiting for search results to load on ${opco.name}`);

      // Wait for search results page to load (URL pattern is /product-search/)
      await page.waitForURL('**/product-search/**', { timeout: TIMEOUT });
      
      // Wait for additional API calls to complete
      await page.waitForTimeout(2000);

      console.log(`✅ Search results page loaded on ${opco.name}`);
      console.log(`📊 Total /json responses intercepted: ${jsonResponses.length}`);

      // Validate that we have captured JSON responses
      expect(jsonResponses.length).toBeGreaterThan(0);

      // Expected slot names for this OPCO
      const expectedSlotName1 = `${opcoKey}.com_website_search_1-flex`;
      const expectedSlotName2 = `${opcoKey}.com_website_search_2-flex`;

      console.log(`🎯 Looking for slot names: ${expectedSlotName1}, ${expectedSlotName2}`);

      // Flatten all responses and look for slot names
      let foundSlotNames: string[] = [];
      
      for (const response of jsonResponses) {
        if (Array.isArray(response)) {
          // Response is an array of banner objects
          for (const item of response) {
            if (item.slotName) {
              foundSlotNames.push(item.slotName);
            }
          }
        } else if (response.slotName) {
          // Response is a single object
          foundSlotNames.push(response.slotName);
        }
      }

      console.log(`📋 Found slot names: ${foundSlotNames.join(', ')}`);

      // Validate that at least one of the expected slot names is present
      const hasSlot1 = foundSlotNames.includes(expectedSlotName1);
      const hasSlot2 = foundSlotNames.includes(expectedSlotName2);

      if (hasSlot1 || hasSlot2) {
        console.log(`✅ Gambit banner slot name validated on ${opco.name}`);
        if (hasSlot1) console.log(`   ✓ Found: ${expectedSlotName1}`);
        if (hasSlot2) console.log(`   ✓ Found: ${expectedSlotName2}`);
      } else {
        console.log(`⚠️  Expected slot names not found. Found: ${foundSlotNames.join(', ')}`);
      }

      // Assert that at least one slot name is present
      expect(hasSlot1 || hasSlot2).toBeTruthy();

      // Take screenshot of search results
      const screenshotPath = `test-results/screenshots/search-result-banner/${opcoKey}-search-results.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved for ${opco.name}`);

      console.log(`🎉 Test PASSED: Gambit banner slot names validated for search "${DEFAULT_SEARCH_KEYWORD}" on ${opco.name}`);
    });
  }
});
