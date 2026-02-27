/**
 * E2E API Test Suite: Banner API Verification
 * 
 * Purpose:
 *   Verifies that the banner/ad API calls return correct slot configurations
 *   for the search dropdown across all OPCO sites.
 * 
 * Test Coverage:
 *   - API endpoint response validation
 *   - Slot configuration verification
 *   - Multi-OPCO slot name validation
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - API Pattern: /json (ad serving endpoint)
 * 
 * @see {@link https://nonprd-delta.{opco}.com}
 */

import { test, expect, Request } from '@playwright/test';
import { PlaywrightHomepagePage } from '../page-objects/PlaywrightHomepagePage';
import { OPCO_CONFIGS, getAllOpcoConfigs, type OPCO, type OpcoConfig } from '../../config/test.config';

// ============================================================================
// Test Configuration
// ============================================================================

const BASE_URL_TEMPLATE = 'https://nonprd-delta.{opco}.com';
const TIMEOUT = 15000;

// ============================================================================
// Main Test Suite: Banner API Verification
// ============================================================================

test.describe('Banner API - Slot Configuration', () => {
  
  // --------------------------------------------------------------------------
  // Test 1: API Response Validation
  // --------------------------------------------------------------------------
  test('should receive valid JSON response from banner API', async ({ page, context }) => {
    let apiCalled = false;
    let apiResponse: any = null;

    // Intercept network requests to capture the banner API call
    await page.route('**/*', async (route) => {
      const request = route.request();
      
      // Look for digitalcontent JSON endpoint (banner ad serving API)
      if (request.url().includes('digitalcontent') && request.url().includes('/json')) {
        console.log(`📡 Intercepted Banner API: ${request.url()}`);
        
        // Continue the request and capture response
        const response = await route.fetch();
        const body = await response.text();
        
        try {
          apiResponse = JSON.parse(body);
          apiCalled = true;
          console.log('✅ Banner API Response received');
        } catch (e) {
          console.log('⚠️  Response is not JSON');
        }
        
        await route.fulfill({ response });
      } else {
        await route.continue();
      }
    });

    // Initialize page object
    const homepage = new PlaywrightHomepagePage(page);
    
    // Navigate to homepage
    await homepage.goto('https://nonprd-delta.stopandshop.com');
    
    // Complete setup
    await homepage.completeInitialSetup('in-store');
    
    // Click search to trigger banner API call
    await expect(homepage.searchInput).toBeVisible({ timeout: TIMEOUT });
    await homepage.clickSearchBar();
    
    // Wait for API call
    await page.waitForTimeout(3000);
    
    // Verify API was called
    expect(apiCalled).toBe(true);
    expect(apiResponse).not.toBeNull();
    expect(apiResponse).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // Test 2: Slot Configuration for Stop & Shop
  // --------------------------------------------------------------------------
  test('should return correct slot configuration for Stop & Shop', async ({ page }) => {
    const opco = OPCO_CONFIGS.stopandshop;
    let apiResponse: any = null;

    // Wait for banner API response containing slot data
    page.on('response', async (response) => {
      const url = response.url();
      
      if (url.includes('digitalcontent') && url.includes('/json')) {
        try {
          const body = await response.json();
          apiResponse = body;
          console.log(`📡 ${opco.name} Banner API Response received`);
        } catch (e) {
          // Not JSON, skip
        }
      }
    });

    const homepage = new PlaywrightHomepagePage(page);
    await homepage.goto(opco.url);
    await homepage.completeInitialSetup('in-store');
    
    await expect(homepage.searchInput).toBeVisible({ timeout: TIMEOUT });
    await homepage.clickSearchBar();
    
    // Wait for API call
    await page.waitForTimeout(3000);
    
    // Verify API response structure (response is an array of slots)
    expect(apiResponse).not.toBeNull();
    expect(Array.isArray(apiResponse)).toBe(true);
    expect(apiResponse.length).toBeGreaterThan(0);
    
    // Verify slot configuration
    const dropdownSlot = apiResponse.find((slot: any) => 
      slot.slotName === opco.expectedSlotName
    );
    
    expect(dropdownSlot).toBeDefined();
    expect(dropdownSlot.slotName).toBe(opco.expectedSlotName);
    expect(dropdownSlot).toHaveProperty('slotID');
    expect(dropdownSlot).toHaveProperty('adType');
  });

  // --------------------------------------------------------------------------
  // Test 3: Multi-OPCO Slot Verification
  // --------------------------------------------------------------------------
  for (const [opcoKey, opcoConfig] of getAllOpcoConfigs()) {
    test(`should return correct slot "${opcoConfig.expectedSlotName}" for ${opcoConfig.name}`, async ({ page }) => {
      let apiResponse: any = null;
      let apiCalled = false;

      // Listen for banner API responses
      page.on('response', async (response) => {
        const url = response.url();
        
        if (url.includes('digitalcontent') && url.includes('/json') && 
            response.status() === 200) {
          try {
            const body = await response.json();
            apiResponse = body;
            apiCalled = true;
            console.log(`📡 [${opcoConfig.name}] Banner API captured`);
          } catch (e) {
            // Not JSON
          }
        }
      });

      const homepage = new PlaywrightHomepagePage(page);
      
      // Navigate to OPCO site
      await homepage.goto(opcoConfig.url);
      
      // Complete setup
      await homepage.completeInitialSetup('in-store');
      
      // Trigger banner API call
      await expect(homepage.searchInput).toBeVisible({ timeout: TIMEOUT });
      await homepage.clickSearchBar();
      
      // Wait for API response
      await page.waitForTimeout(4000);
      
      // Verify API was called
      expect(apiCalled).toBe(true);
      expect(apiResponse).not.toBeNull();
      
      // Verify response structure (array of slots)
      expect(Array.isArray(apiResponse)).toBe(true);
      expect(apiResponse.length).toBeGreaterThan(0);
      
      // Verify specific slot for this OPCO
      const dropdownSlot = apiResponse.find((slot: any) => 
        slot.slotName && slot.slotName.includes('dropdown-flex')
      );
      
      expect(dropdownSlot).toBeDefined();
      expect(dropdownSlot.slotName).toBe(opcoConfig.expectedSlotName);
      expect(dropdownSlot).toHaveProperty('slotID');
      expect(dropdownSlot).toHaveProperty('adType');
      
      console.log(`✅ [${opcoConfig.name}] Verified slot: ${dropdownSlot.slotName}`);
    });
  }

});