/**
 * User Agent Configuration
 * Manages QA user agent for bypassing security on non-prod environments
 */

import TEST_CONFIG from './test.config';

/**
 * Current QA User Agent
 * This is required to bypass security blocks on delta and beta environments
 * 
 * Format: qa-reg-(pdl)-cua/VERSION; +reg/VERSION
 * Current: qa-reg-(pdl)-cua/05:01; +reg/18
 * 
 * TO UPDATE:
 * 1. Update the value in test.config.ts (qaUserAgent field)
 * 2. Or set environment variable: TEST_USER_AGENT=<new-value>
 * 3. Restart your tests
 */

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

export default {
  getQaUserAgent,
  isValidQaUserAgent,
  getUserAgentWithFallback,
  hasValidUserAgent,
  UPDATE_INSTRUCTIONS,
  logUserAgentConfig,
};
