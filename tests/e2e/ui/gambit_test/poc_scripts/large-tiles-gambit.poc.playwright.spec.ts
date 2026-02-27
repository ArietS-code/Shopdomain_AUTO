import { test, expect, type Locator, type Page } from '@playwright/test';
import { PlaywrightHomepagePage } from '../../../page-objects/PlaywrightHomepagePage';
import { getOpcoConfig, type OPCO } from '../../../../config/test.config';
import { setupGambitSession } from '../../../../utils/gambit-helpers';

const TARGET_OPCO = (process.env.TEST_OPCO as OPCO) || 'hannaford';

const LARGE_TILE_CAROUSEL_SELECTOR = '[class*="large-tile-carousel"]';
const LARGE_TILE_CARD_SELECTORS = [
  '[class*="large-tile-carousel"] [class*="large-tile-carousel_carousel_item"]',
  '[class*="large-tile-carousel"] [class*="carousel-item"]',
  '[class*="large-tile-carousel"] [class*="carousel_item"]',
  '[class*="large-tile-carousel"] [class*="pdl-carousel_item"]',
  '[class*="large-tile-carousel"] [class*="pdl-carousel_content"] > div',
  '[class*="large-tile-carousel"] [islastslide] > div',
];

async function scrollUntilVisible(page: Page, locator: Locator, maxAttempts = 15, stepPx = 450): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const visible = await locator.first().isVisible().catch(() => false);
    if (visible) {
      console.log(`✅ Target found after ${attempt - 1} scroll(s)`);
      return true;
    }

    await page.evaluate((step) => window.scrollBy(0, step), stepPx);
    await page.waitForTimeout(500);
  }

  return false;
}

async function findLargeTileCards(page: Page): Promise<{ locator: Locator; count: number; selector: string }> {
  for (const selector of LARGE_TILE_CARD_SELECTORS) {
    const locator = page.locator(selector);
    const count = await locator.count();
    if (count > 0) {
      return { locator, count, selector };
    }
  }

  return {
    locator: page.locator(LARGE_TILE_CARD_SELECTORS[0]),
    count: 0,
    selector: LARGE_TILE_CARD_SELECTORS[0],
  };
}

test.describe('POC - Gambit Large Tiles', () => {
  test(`Validate large tile section + Sponsored label on ${TARGET_OPCO}`, async ({ page, context }) => {
    const opco = getOpcoConfig(TARGET_OPCO);

    await setupGambitSession(page, context);

    const observedSlots = new Set<string>();

    page.on('request', request => {
      const payload = request.postData();
      if (!payload || (!request.url().includes('/ads') && !request.url().includes('adhese'))) {
        return;
      }

      try {
        const data = JSON.parse(payload);
        const slots = Array.isArray(data?.slots) ? data.slots : Array.isArray(data) ? data : [];

        for (const slot of slots) {
          const slotName = slot?.slotname || slot?.slotName;
          if (typeof slotName === 'string' && slotName.includes('large_tile')) {
            observedSlots.add(slotName);
          }
        }
      } catch {
        // ignore malformed payloads
      }
    });

    const homepage = new PlaywrightHomepagePage(page);
    await homepage.goto(opco.url);
    await homepage.waitForPageReady();
    await homepage.completeInitialSetup('in-store');

    const largeTileCarousel = page.locator(LARGE_TILE_CAROUSEL_SELECTOR);
    const foundCarousel = await scrollUntilVisible(page, largeTileCarousel);

    expect(foundCarousel, 'Expected to find large tile carousel after scrolling').toBeTruthy();
    await expect(largeTileCarousel.first()).toBeVisible({ timeout: 10000 });

    const { locator: largeTileCards, count: cardCount, selector } = await findLargeTileCards(page);
    console.log(`📊 Large tile card count: ${cardCount}`);
    console.log(`🧭 Matched card selector: ${selector}`);
    expect(cardCount, 'Expected at least one large tile card').toBeGreaterThan(0);

    const sponsoredLabelInSection = largeTileCarousel.locator('text=Sponsored').first();
    const sponsoredLabelGlobal = page.locator('text=Sponsored').first();

    const hasSponsoredInSection = await sponsoredLabelInSection.isVisible().catch(() => false);
    const hasSponsoredGlobal = await sponsoredLabelGlobal.isVisible().catch(() => false);

    if (hasSponsoredInSection || hasSponsoredGlobal) {
      console.log('✅ Sponsored label detected near large-tile section');
    } else {
      console.log('⚠️ Sponsored label not detected in current run (possible no-fill / non-Gambit content)');
    }

    const expectedSlot = `${TARGET_OPCO}.com_website_home_large_tile_1-flex`;
    const hasExpectedSlot = [...observedSlots].some(slot => slot.includes('large_tile_1-flex'));

    console.log(`📡 Observed large tile slots: ${JSON.stringify([...observedSlots])}`);
    console.log(`🎯 Expected slot pattern: ${expectedSlot}`);

    if (hasExpectedSlot) {
      console.log('✅ Large-tile slot request detected');
    } else {
      console.log('⚠️ No large-tile slot request detected in captured traffic');
    }

    await page.screenshot({
      path: `test-results/screenshots/large-tiles/${TARGET_OPCO}-gambit-poc-full-page.png`,
      fullPage: true,
    });

    await largeTileCarousel.first().screenshot({
      path: `test-results/screenshots/large-tiles/${TARGET_OPCO}-gambit-poc-large-tile-section.png`,
    });
  });
});
