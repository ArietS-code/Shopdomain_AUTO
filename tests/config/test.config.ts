/**
 * Test Configuration
 * Central configuration for all test suites
 * Consolidates OPCO, environment, and test settings
 */

// Valid OPCO values
export type OPCO = 
  | 'stopandshop'
  | 'giantfood'
  | 'foodlion'
  | 'martinsfoods'
  | 'giantfoodstores'
  | 'hannaford';

// Valid environment values
export type Environment = 'beta' | 'delta';

// OPCO Configuration Interface
export interface OpcoConfig {
  name: string;
  url: string;
  expectedSlotName: string;
}

// Get OPCO from environment variable or default
const OPCO: OPCO = (process.env.TEST_OPCO as OPCO) || 'stopandshop';

// Get environment from environment variable or default
const ENV: Environment = (process.env.TEST_ENV as Environment) || 'delta';

// Build dynamic base URL
const buildBaseUrl = (opco: OPCO, env: Environment): string => {
  return `https://nonprd-${env}.${opco}.com/`;
};

// All valid OPCO values
export const VALID_OPCOS: OPCO[] = [
  'stopandshop',
  'giantfood',
  'foodlion',
  'martinsfoods',
  'giantfoodstores',
  'hannaford',
];

// All valid environment values
export const VALID_ENVIRONMENTS: Environment[] = ['beta', 'delta'];

// OPCO display names for reporting
export const OPCO_DISPLAY_NAMES: Record<OPCO, string> = {
  stopandshop: 'Stop & Shop',
  giantfood: 'Giant Food',
  foodlion: 'Food Lion',
  martinsfoods: "Martin's Foods",
  giantfoodstores: 'Giant Food Stores',
  hannaford: 'Hannaford',
};

// Complete OPCO configurations with URLs and expected slot names
export const OPCO_CONFIGS: Record<OPCO, OpcoConfig> = {
  stopandshop: {
    name: 'Stop & Shop',
    url: 'https://nonprd-delta.stopandshop.com',
    expectedSlotName: 'stopandshop.com_website_dropdown-flex',
  },
  giantfood: {
    name: 'Giant Food',
    url: 'https://nonprd-delta.giantfood.com',
    expectedSlotName: 'giantfood.com_website_dropdown-flex',
  },
  foodlion: {
    name: 'Food Lion',
    url: 'https://nonprd-delta.foodlion.com',
    expectedSlotName: 'foodlion.com_website_dropdown-flex',
  },
  martinsfoods: {
    name: 'Martin\'s Foods',
    url: 'https://nonprd-delta.martinsfoods.com',
    expectedSlotName: 'martinsfoods.com_website_dropdown-flex',
  },
  giantfoodstores: {
    name: 'Giant Food Stores',
    url: 'https://nonprd-delta.giantfoodstores.com',
    expectedSlotName: 'giantfoodstores.com_website_dropdown-flex',
  },
  hannaford: {
    name: 'Hannaford',
    url: 'https://nonprd-delta.hannaford.com',
    expectedSlotName: 'hannaford.com_website_dropdown-flex',
  },
};

export const TEST_CONFIG = {
  // OPCO Configuration
  opco: OPCO,
  environment: ENV,

  // Base URL builder function
  buildBaseUrl,

  // Base URLs
  baseUrl: process.env.VITE_APP_BASE_URL || buildBaseUrl(OPCO, ENV),
  apiBaseUrl: process.env.VITE_API_BASE_URL || buildBaseUrl(OPCO, ENV),

  // Timeouts (in milliseconds)
  timeouts: {
    default: 5000,
    navigation: 10000,
    api: 15000,
    long: 30000,
  },

  // Retry configuration
  retries: {
    api: 3,
    ui: 2,
  },

  // Test user credentials (for authenticated tests)
  testUsers: {
    default: {
      username: 'test@example.com',
      password: 'Test123!',
    },
    admin: {
      username: 'admin@example.com',
      password: 'Admin123!',
    },
  },

  // API configuration
  api: {
    headers: {
      // QA User Agent for bypassing security block on delta/beta environments
      // Update this value when new user agent is provided
      // Format: qa-reg-(pdl)-cua/VERSION; +reg/VERSION
      'User-Agent': process.env.TEST_USER_AGENT || 'qa-reg-(pdl)-cua/05:01; +reg/18',
      Accept: 'application/json, text/html, */*',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    timeout: 15000,
  },

  // QA User Agent (for security bypass on non-prod environments)
  // This is required to access delta and beta environments
  // Update this when new user agent credentials are provided
  qaUserAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',

  // Screenshot configuration
  screenshots: {
    onFailure: true,
    directory: './tests/screenshots',
  },

  // Test data
  testData: {
    searchQuery: 'milk',
    categoryId: 'dairy',
    productId: 'test-product-1',
  },
};

/**
 * Helper function to get the appropriate user agent based on environment
 */
export function getUserAgent(): string {
  return TEST_CONFIG.qaUserAgent;
}

/**
 * Get the current QA user agent
 */
export function getQaUserAgent(): string {
  return TEST_CONFIG.qaUserAgent;
}

/**
 * Validate user agent format (basic check)
 */
export function isValidQaUserAgent(userAgent: string): boolean {
  // Check if it matches the expected pattern: qa-reg-(pdl)-cua/XX:XX; +reg/XX
  const pattern = /^qa-reg-\(pdl\)-cua\/\d{2}:\d{2};\s\+reg\/\d{2}$/;
  return pattern.test(userAgent);
}

/**
 * Get user agent with fallback
 */
export function getUserAgentWithFallback(customUserAgent?: string): string {
  if (customUserAgent && isValidQaUserAgent(customUserAgent)) {
    return customUserAgent;
  }
  return getQaUserAgent();
}

/**
 * Check if user agent is configured
 */
export function hasValidUserAgent(): boolean {
  const userAgent = getQaUserAgent();
  return isValidQaUserAgent(userAgent);
}

/**
 * Instructions for updating user agent
 */
export const UPDATE_INSTRUCTIONS = `
To update the QA User Agent:

METHOD 1 - Update Configuration File:
1. Open: tests/config/test.config.ts
2. Find: qaUserAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18'
3. Replace with new value
4. Save and restart tests

METHOD 2 - Environment Variable:
export TEST_USER_AGENT="qa-reg-(pdl)-cua/NEW:VERSION; +reg/NEW"
npm run test:unit

METHOD 3 - Runtime Override:
TEST_USER_AGENT="qa-reg-(pdl)-cua/06:02; +reg/19" npm run test:unit

Current User Agent: ${getQaUserAgent()}
Valid Format: ${hasValidUserAgent() ? '✓ YES' : '✗ NO'}
`;

/**
 * Log current user agent configuration
 */
export function logUserAgentConfig(): void {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('QA User Agent Configuration');
  console.log('═══════════════════════════════════════════════════');
  console.log(`User Agent: ${getQaUserAgent()}`);
  console.log(`Valid Format: ${hasValidUserAgent() ? '✓ YES' : '✗ NO'}`);
  console.log(`Environment: ${TEST_CONFIG.environment}`);
  console.log(`OPCO: ${TEST_CONFIG.opco}`);
  console.log(`Base URL: ${TEST_CONFIG.baseUrl}`);
  console.log('═══════════════════════════════════════════════════\n');
}

/**
 * Get OPCO configuration by key
 * @param key - OPCO identifier (stopandshop, giantfood, etc.)
 * @returns OPCO configuration object
 */
export function getOpcoConfig(opco: OPCO): OpcoConfig {
  return OPCO_CONFIGS[opco];
}

/**
 * Get all OPCO configurations as an array
 * @returns Array of [key, config] tuples
 */
export function getAllOpcoConfigs(): [string, OpcoConfig][] {
  return Object.entries(OPCO_CONFIGS);
}

/**
 * Get all OPCO names
 * @returns Array of OPCO display names
 */
export function getOpcoNames(): string[] {
  return Object.values(OPCO_CONFIGS).map(config => config.name);
}

/**
 * Get OPCO URL by key
 * @param key - OPCO identifier
 * @returns OPCO URL
 */
export function getOpcoUrl(opco: OPCO): string {
  return OPCO_CONFIGS[opco].url;
}

/**
 * Build URL for specific OPCO and environment
 */
export function buildUrlForOpco(opco: OPCO, env: Environment): string {
  return `https://nonprd-${env}.${opco}.com/`;
}

/**
 * Get current OPCO configuration
 */
export function getCurrentOpco(): OPCO {
  return TEST_CONFIG.opco;
}

/**
 * Get current environment
 */
export function getCurrentEnvironment(): Environment {
  return TEST_CONFIG.environment;
}

/**
 * Get current base URL
 */
export function getCurrentBaseUrl(): string {
  return TEST_CONFIG.baseUrl;
}

/**
 * Validate OPCO value
 */
export function isValidOpco(opco: string): opco is OPCO {
  return VALID_OPCOS.includes(opco as OPCO);
}

/**
 * Validate environment value
 */
export function isValidEnvironment(env: string): env is Environment {
  return VALID_ENVIRONMENTS.includes(env as Environment);
}

/**
 * Get display name for OPCO
 */
export function getOpcoDisplayName(opco: OPCO): string {
  return OPCO_DISPLAY_NAMES[opco];
}

export default TEST_CONFIG;
