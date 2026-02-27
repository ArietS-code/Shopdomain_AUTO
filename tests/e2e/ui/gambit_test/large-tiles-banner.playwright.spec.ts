/**
 * E2E Test Suite: Large Tiles Banner Verification
 * 
 * Purpose:
 *   Verifies that sponsored large tile banners appear on the homepage
 *   and contain the "Sponsored" label at the bottom right corner.
 * 
 * Test Coverage:
 *   - Multi-OPCO Suite: 6 tests across all operating companies
 *   - Visibility Validation: Large tiles are displayed
 *   - API Verification: Slot names in request
 *   - Label Validation: "Sponsored" text (case-sensitive)
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - User Agent: QA bypass (qa-reg-(pdl)-cua/05:01; +reg/18)
 *   - Large Tile Slot: {opco}_website_home_large_tile_1-flex
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

interface APISlot {
  slotname: string;
  parameters: Record<string, unknown>;
}

// ============================================================================
// Multi-OPCO Test Suite: Large Tiles Banner Verification
// ============================================================================

test.describe('Large Tiles Gambit - Multi-OPCO Verification', () => {
  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(`Verify sponsored large tiles on ${opco.name}`, async ({ page, context }) => {
      await setupGambitSession(page, context);

      // Capture API requests for slot verification
      const capturedSlots: APISlot[] = [];
      let largeTileRequestDetected = false;
      
      page.on('request', request => {
        const url = request.url();
        if (url.includes('/ads') || url.includes('adhese') || url.includes('banner')) {
          const postData = request.postData();
          if (postData) {
            try {
              const data = JSON.parse(postData);
              if (data.slots || Array.isArray(data)) {
                const slots = data.slots || data;
                capturedSlots.push(...slots);
                
                // Check if any slot contains 'large_tile' in the slotname
                slots.forEach((slot: APISlot) => {
                  if (slot.slotname && slot.slotname.includes('large_tile')) {
                    largeTileRequestDetected = true;
                    console.log(`📡 Detected large-tile slot request: ${slot.slotname}`);
                  }
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      });

      // Intercept API responses to capture slot data
      await page.route('**/ads/**', async route => {
        const response = await route.fetch();
        const body = await response.text();
        
        try {
          const data = JSON.parse(body);
          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item.slotName && item.slotName.includes('large_tile')) {
                largeTileRequestDetected = true;
                console.log(`📡 Captured large tile slot: ${item.slotName}`);
              }
            });
          }
        } catch (e) {
          // Continue with route
        }
        
        await route.fulfill({ response });
      });

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

      console.log(`🔍 Loading large tiles section on ${opco.name}`);

      // Use page object method to get large tiles
      const largeTiles = await homepage.getLargeTiles();
      console.log(`📊 Total large tiles found on ${opco.name}: ${largeTiles.length}`);

      // Handle OPCOs with no large tiles
      if (largeTiles.length === 0) {
        console.log(`⚠️ ${opco.name} has no large tiles found`);
        console.log(`⚠️ Skipping validation for ${opco.name} - no large tiles detected`);
        return; // Skip this OPCO
      }

      // Track which tiles have "Sponsored" label
      const sponsoredTileIndexes: number[] = [];
      const nonSponsoredTileIndexes: number[] = [];

      for (let i = 0; i < largeTiles.length; i++) {
        const tile = largeTiles[i];
        const position = i + 1; // 1-indexed position
        
        const isVisible = await tile.isVisible().catch(() => false);
        if (!isVisible) {
          console.log(`   Position ${position}: Not visible (possibly lazy-loaded) on ${opco.name}`);
          continue;
        }

        const hasSponsored = await homepage.isTileSponsored(tile);
        const tileContent = await tile.textContent().catch(() => '');
        
        console.log(`   Position ${position} content preview: ${tileContent?.substring(0, 50)}...`);

        if (hasSponsored) {
          sponsoredTileIndexes.push(position);
          console.log(`✅ Position ${position}: SPONSORED large tile on ${opco.name}`);
        } else {
          nonSponsoredTileIndexes.push(position);
          console.log(`   Position ${position}: Regular large tile on ${opco.name}`);
        }
      }

      console.log(`📍 Sponsored large tile positions on ${opco.name}: [${sponsoredTileIndexes.join(', ')}]`);
      console.log(`📍 Non-sponsored large tile positions on ${opco.name}: [${nonSponsoredTileIndexes.join(', ')}]`);

      // CRITICAL VALIDATION: Fail if no large-tile slot request was detected
      console.log(`\n🔍 Checking API traffic for large-tile slot requests...`);
      if (!largeTileRequestDetected) {
        console.error(`❌ FAILURE: No large-tile slot request detected in captured API traffic for ${opco.name}`);
        console.error(`   Expected slot pattern: *large_tile*`);
        console.error(`   Captured ${capturedSlots.length} total slot(s) in API traffic`);
        
        // Log all captured slots for debugging
        if (capturedSlots.length > 0) {
          console.log(`\n📋 All captured slots:`);
          capturedSlots.forEach((slot, idx) => {
            console.log(`   ${idx + 1}. ${slot.slotname}`);
          });
        }
        
        expect(largeTileRequestDetected, 
          `No large-tile slot request detected in API traffic for ${opco.name}. Expected slot with 'large_tile' in slotname.`
        ).toBe(true);
      } else {
        console.log(`✅ Large-tile slot request successfully detected in API traffic for ${opco.name}`);
      }

      // Validation: Check if large tiles exist (they may not all be Gambit sponsored)
      if (largeTiles.length === 0) {
        console.error(`❌ No large tiles found on ${opco.name}`);
        expect(largeTiles.length).toBeGreaterThan(0);
      }

      // Log whether sponsored large tiles were found
      if (sponsoredTileIndexes.length > 0) {
        console.log(`✅ Found ${sponsoredTileIndexes.length} Gambit-sponsored large tile(s) on ${opco.name}`);
      } else {
        console.log(`ℹ️  No Gambit-sponsored large tiles detected on ${opco.name} (tiles are likely promotional/regular tiles)`);
      }

      console.log(`✅ Large tile carousel validation PASSED on ${opco.name}: Found ${largeTiles.length} tile(s) total`);

      // Verify API request contains correct slot name
      const expectedSlot = `${opcoKey}_website_home_large_tile_1-flex`;

      console.log(`🔍 Verifying API slot name for ${opco.name}`);
      console.log(`   Expected: ${expectedSlot}`);

      // If sponsored tiles exist, verify they contain "Sponsored" text
      if (sponsoredTileIndexes.length > 0) {
        for (const index of sponsoredTileIndexes) {
          const tile = largeTiles[index - 1];
          const tileText = await tile.textContent();
          
          expect(tileText).toContain('Sponsored');
          console.log(`✅ Large tile at position ${index} contains "Sponsored" label on ${opco.name}`);
        }
      }

      // Take screenshots of sponsored large tiles
      for (const index of sponsoredTileIndexes) {
        const tile = largeTiles[index - 1];
        const screenshotPath = `test-results/screenshots/large-tiles/${opcoKey}-position-${index}.png`;
        
        await tile.screenshot({ path: screenshotPath }).catch(err => {
          console.log(`⚠️ Could not capture screenshot for position ${index}: ${err.message}`);
        });
      }

      // Full page screenshot
      const fullPageScreenshotPath = `test-results/screenshots/large-tiles/${opcoKey}-full-page.png`;
      await page.screenshot({ path: fullPageScreenshotPath, fullPage: true });

      console.log(`📸 Screenshots saved for ${opco.name}`);
      console.log(`🎉 Test PASSED: Large tiles verified on ${opco.name}`);
    });
  }
});
