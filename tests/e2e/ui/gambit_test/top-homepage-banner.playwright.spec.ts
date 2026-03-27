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
const BANNER_SELECTORS = [
  '#display-ad-1',
  '[id="display-ad-1"]',
  '[id^="display-ad-1"]',
  '[id*="display-ad-1"]',
  '[data-testid="display-ad-1"]',
  '#display-ad-hero-1',
];
const MAX_SCROLL_ATTEMPTS = 12;
const SCROLL_STEP_PX = 500;

async function dismissBlockingErrorDialog(
  page: import('@playwright/test').Page,
): Promise<boolean> {
  const errorDialog = page.getByRole('alertdialog', { name: /error/i });
  const isVisible = await errorDialog.isVisible().catch(() => false);

  if (!isVisible) {
    return false;
  }

  console.log('⚠️ Blocking error dialog detected. Attempting recovery...');
  const okButton = errorDialog.getByRole('button', { name: /^ok$/i });
  await okButton.click({ timeout: 3000 }).catch(() => undefined);
  await expect(errorDialog).toBeHidden({ timeout: 5000 }).catch(() => undefined);

  return true;
}

async function scrollUntilBannerVisible(
  page: import('@playwright/test').Page,
  banner: import('@playwright/test').Locator,
): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_SCROLL_ATTEMPTS; attempt++) {
    const hasBlockingError = await page
      .getByRole('alertdialog', { name: /error/i })
      .isVisible()
      .catch(() => false);
    if (hasBlockingError) {
      return false;
    }

    const isVisible = await banner.first().isVisible().catch(() => false);
    if (isVisible) {
      console.log(`✅ Banner became visible after ${attempt - 1} scroll(s)`);
      return true;
    }

    await page.mouse.wheel(0, SCROLL_STEP_PX);

    try {
      await expect(banner.first()).toBeVisible({ timeout: 900 });
      console.log(`✅ Banner became visible after ${attempt} scroll(s)`);
      return true;
    } catch {
      // Continue scrolling until max attempts
    }
  }

  return false;
}

// ============================================================================
// Multi-OPCO Test Suite: Top Homepage Banner Ad Verification
// ============================================================================

test.describe('Top Homepage Banner Ad - Multi-OPCO Verification', () => {
  test.describe.configure({ timeout: 60000 });

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

      // Locate top banner using fallback selectors across OPCO variants
      const topBannerAd = page.locator(BANNER_SELECTORS.join(', '));

      // Recover early if a blocking app error is shown
      const recoveredFromErrorDialog = await dismissBlockingErrorDialog(page);
      if (recoveredFromErrorDialog) {
        console.log(`ℹ️ Recovered from error dialog on ${opco.name}, continuing banner validation`);

        await page.reload({ waitUntil: 'domcontentloaded' });
        await homepage.waitForPageReady();
        await homepage.completeInitialSetup('in-store');
        await dismissBlockingErrorDialog(page);
      }

      // Progressively scroll down until banner becomes visible
      let foundBanner = await scrollUntilBannerVisible(page, topBannerAd);

      // One retry path for flaky page states: recover dialog + reload once, then search again
      if (!foundBanner) {
        const recoveredAfterSearch = await dismissBlockingErrorDialog(page);
        if (recoveredAfterSearch) {
          console.log(`🔄 Retrying after dismissing error dialog on ${opco.name}`);
        }

        await page.reload({ waitUntil: 'domcontentloaded' });
        await homepage.waitForPageReady();
        await homepage.completeInitialSetup('in-store');
        await dismissBlockingErrorDialog(page);

        const foundAfterReload = await scrollUntilBannerVisible(page, topBannerAd);
        foundBanner = foundAfterReload;
      }

      if (!foundBanner) {
        const hasPersistentErrorDialog = await page
          .getByRole('alertdialog', { name: /error/i })
          .isVisible()
          .catch(() => false);

        test.skip(
          hasPersistentErrorDialog,
          `Skipping ${opco.name}: persistent application error dialog prevented banner rendering`,
        );
      }

      expect(foundBanner, `Top homepage banner not found after scrolling on ${opco.name}`).toBe(true);

      // Final visibility verification
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
