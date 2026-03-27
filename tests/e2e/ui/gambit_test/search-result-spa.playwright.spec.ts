import { test, expect, type Locator, type Page, type Request, type Response } from '@playwright/test';
import { PlaywrightHomepagePage } from '../../page-objects/PlaywrightHomepagePage';
import { getAllOpcoConfigs } from '../../../config/test.config';
import { setupGambitSession } from '../../../utils/gambit-helpers.js';

type GambitRequestCapture = {
  url: string;
  method: string;
  payload: unknown;
};

type GambitResponseCapture = {
  url: string;
  status: number;
};

const SEARCH_TERMS = ['cola', 'soda', 'sprite', 'eggs', 'bars'];
const ALLOWED_SPONSORED_SLOTS = [1, 3, 4, 7, 9, 11, 13, 17, 19, 21];

async function dismissBlockingDialogs(page: Page): Promise<void> {
  const errorDialog = page.getByRole('alertdialog', { name: /error/i });
  if (await errorDialog.isVisible().catch(() => false)) {
    await errorDialog.getByRole('button', { name: /^ok$/i }).click().catch(() => undefined);
  }

  const welcomeClose = page.getByRole('button', { name: /close dialog|close/i }).first();
  if (await welcomeClose.isVisible().catch(() => false)) {
    await welcomeClose.click().catch(() => undefined);
  }

  const getStarted = page.getByRole('button', { name: /get started/i });
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click().catch(() => undefined);
  }
}

async function firstVisible(locators: Locator[]): Promise<Locator> {
  for (const locator of locators) {
    const visible = await locator.first().isVisible().catch(() => false);
    if (visible) {
      return locator.first();
    }
  }
  throw new Error('No visible locator matched for the requested element.');
}

function isGambitUrl(url: string): boolean {
  return url.includes('/json') || url.includes('adhese') || url.includes('/ads');
}

function parsePayload(request: Request): unknown {
  const postData = request.postData();

  if (!postData) {
    return null;
  }

  try {
    return JSON.parse(postData);
  } catch {
    return postData;
  }
}

function payloadContainsSearchKeyword(payload: unknown, keyword: string): boolean {
  const text = JSON.stringify(payload ?? '').toLowerCase();
  return text.includes(keyword.toLowerCase());
}

async function collectGambitTraffic(
  page: Page,
  action: () => Promise<void>,
): Promise<{ requests: GambitRequestCapture[]; responses: GambitResponseCapture[] }> {
  const requests: GambitRequestCapture[] = [];
  const responses: GambitResponseCapture[] = [];

  const onRequest = (request: Request): void => {
    if (!isGambitUrl(request.url())) {
      return;
    }

    requests.push({
      url: request.url(),
      method: request.method(),
      payload: parsePayload(request),
    });
  };

  const onResponse = (response: Response): void => {
    if (!isGambitUrl(response.url())) {
      return;
    }

    responses.push({
      url: response.url(),
      status: response.status(),
    });
  };

  page.on('request', onRequest);
  page.on('response', onResponse);

  try {
    await action();
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => undefined);
  } finally {
    page.off('request', onRequest);
    page.off('response', onResponse);
  }

  return { requests, responses };
}

async function runSearch(page: Page, homepage: PlaywrightHomepagePage, searchTerm: string): Promise<void> {
  await dismissBlockingDialogs(page);

  await homepage.clickSearchBar({ force: true });

  const searchInput = await firstVisible([
    homepage.searchInput,
    page.locator('input[type="search"]').first(),
    page.locator('input[placeholder*="Search"]').first(),
  ]);

  await searchInput.fill(searchTerm);
  await searchInput.press('Enter');

  await page.waitForURL('**/product-search/**', { timeout: 15000 });
}

async function getSponsoredSlotPositions(page: Page): Promise<number[]> {
  const productCards = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('button', { name: /add to cart|out of stock|view similar items/i }) });

  const cardCount = Math.min(await productCards.count(), 25);
  const sponsoredPositions: number[] = [];

  let visibleProductIndex = 0;

  for (let i = 0; i < cardCount; i += 1) {
    const card = productCards.nth(i);
    const isVisible = await card.isVisible().catch(() => false);
    if (!isVisible) {
      continue;
    }

    const cardText = (await card.textContent().catch(() => '')) ?? '';

    visibleProductIndex += 1;
    if (/sponsored/i.test(cardText)) {
      sponsoredPositions.push(visibleProductIndex);
    }
  }

  return sponsoredPositions;
}

test.describe('Search Result SPA - Gambit Validation', () => {
  test.describe.configure({ timeout: 90000 });

  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    test(
      `Validate sponsored slot locations on search results for ${opco.name}`,
      {
        tag: ['@gambit', '@searchresults', '@spa', `@${opcoKey}`],
      },
      async ({ page, context }) => {
        await setupGambitSession(page, context);

        const homepage = new PlaywrightHomepagePage(page);

        const searchTerms: string[] = [...SEARCH_TERMS];
        let selectedSearchTerm = '';
        let selectedTraffic: { requests: GambitRequestCapture[]; responses: GambitResponseCapture[] } | null = null;
        let sponsoredPositions: number[] = [];

        await test.step('1. Build app URL and open homepage', async () => {
          await homepage.goto(opco.url);
          await homepage.waitForPageReady();
          await homepage.completeInitialSetup('in-store');
          await dismissBlockingDialogs(page);
        });

        await test.step('2. Search products and validate sponsored slot locations', async () => {
          for (const searchTerm of searchTerms) {
            const traffic = await collectGambitTraffic(page, async () => {
              await runSearch(page, homepage, searchTerm);
            });

            sponsoredPositions = await getSponsoredSlotPositions(page);

            if (sponsoredPositions.length > 0) {
              selectedSearchTerm = searchTerm;
              selectedTraffic = traffic;
              break;
            }

            console.log(`[${opcoKey}] No sponsored products found for search term: ${searchTerm}`);
          }

          if (!selectedSearchTerm || !selectedTraffic) {
            throw new Error(
              `No sponsored products found for any of the search terms: ${searchTerms.join(', ')}`,
            );
          }

          const gambitRequests = selectedTraffic.requests;
          const gambitResponses = selectedTraffic.responses;

          expect(gambitRequests.length, 'Gambit call should be made to fetch sponsored ads').toBeGreaterThan(0);

          const keywordPresentInPayload = gambitRequests.some(({ payload }) =>
            payloadContainsSearchKeyword(payload, selectedSearchTerm),
          );

          expect(
            keywordPresentInPayload,
            'Gambit targeting payload should include the user search keyword',
          ).toBeTruthy();

          const successfulGambitResponses = gambitResponses.filter(({ status }) => status >= 200 && status < 300);
          expect(
            successfulGambitResponses.length,
            'Gambit should return successful response for ad fetch',
          ).toBeGreaterThan(0);

          expect(
            sponsoredPositions.length,
            'Sponsored products should be displayed on search results page when Gambit returns ads',
          ).toBeGreaterThan(0);

          for (const position of sponsoredPositions) {
            expect(
              ALLOWED_SPONSORED_SLOTS.includes(position),
              `Sponsored product slot ${position} is outside expected slots: ${ALLOWED_SPONSORED_SLOTS.join(', ')}`,
            ).toBeTruthy();
          }

          console.log(`[${opcoKey}] Search keyword selected: ${selectedSearchTerm}`);
          console.log(`[${opcoKey}] Sponsored slot positions: ${sponsoredPositions.join(', ')}`);
          console.log(`[${opcoKey}] Gambit requests captured: ${gambitRequests.length}`);
          console.log(`[${opcoKey}] Gambit responses captured: ${gambitResponses.length}`);
        });
      },
    );
  }
});
