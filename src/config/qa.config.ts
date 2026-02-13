/**
 * Quality Assurance Configuration
 * User agent and testing configuration for Stop & Shop QA environment
 */

export const QA_CONFIG = {
  // Custom user agent to avoid being blocked by Stop & Shop non-prod environment
  // IMPORTANT: Use this user agent instead of browser default
  userAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',
  
  // Target environment
  baseUrl: 'https://nonprd-delta.stopandshop.com',
  
  // Test configuration
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  
  // Network conditions for testing
  networkConditions: {
    throttling: 'No throttling',
    caching: 'Disable cache',
  },
  
  // Content encoding
  acceptedEncodings: ['deflate', 'gzip', 'br', 'zstd'],
};

export default QA_CONFIG;
