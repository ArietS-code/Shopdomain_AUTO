import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { 
      outputFolder: 'test-results/html-report',
      open: 'always' // Always open report after test run
    }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.TEST_BASE_URL || 'https://nonprd-delta.stopandshop.com',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure and success for UI tests */
    screenshot: 'on',
    
    /* Video settings */
    video: 'retain-on-failure',
    
    /* Browser context options to avoid bot detection */
    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled', // Hide automation
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
      ],
    },
    
    /* Additional context options */
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  },
  
  /* Configure output directory for test artifacts */
  outputDir: 'test-results/artifacts',
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // QA user agent for security bypass
        userAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',
        // Locale and timezone to appear more realistic
        locale: 'en-US',
        timezoneId: 'America/New_York',
        // Permissions
        permissions: ['geolocation'],
        geolocation: { longitude: -74.0060, latitude: 40.7128 }, // New York
        // Extra HTTP headers
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
    },
  ],
  
  /* Configure timeout */
  timeout: 30000,
  expect: {
    timeout: 10000
  },
});
