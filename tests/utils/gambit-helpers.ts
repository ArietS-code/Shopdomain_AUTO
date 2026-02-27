import type { BrowserContext, Page } from '@playwright/test';

export const QA_USER_AGENT = process.env.TEST_USER_AGENT || 'qa-reg-(pdl)-cua/05:01; +reg/18';

/**
 * Applies shared anti-bot init script and QA user-agent header.
 */
export async function setupGambitSession(page: Page, context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });

    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    (window as Window & { chrome?: { runtime: Record<string, unknown> } }).chrome = {
      runtime: {},
    };

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: PermissionDescriptor) => (
      parameters.name === 'notifications'
        ? Promise.resolve({ state: 'prompt' } as PermissionStatus)
        : originalQuery(parameters)
    );
  });

  await page.setExtraHTTPHeaders({
    'User-Agent': QA_USER_AGENT,
  });
}
