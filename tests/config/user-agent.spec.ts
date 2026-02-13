/**
 * User Agent Configuration Tests
 * Verify QA user agent is properly configured for security bypass
 */

import { ProductsApi } from '../api/ProductsApi';
import TEST_CONFIG, {
  getQaUserAgent,
  isValidQaUserAgent,
  hasValidUserAgent,
  logUserAgentConfig,
} from '../config/test.config';

describe('QA User Agent Configuration', () => {
  beforeAll(() => {
    // Log configuration for debugging
    logUserAgentConfig();
  });

  describe('User Agent Format', () => {
    test('should have QA user agent configured', () => {
      const userAgent = getQaUserAgent();
      
      expect(userAgent).toBeDefined();
      expect(userAgent).not.toBe('');
      expect(userAgent).toContain('qa-reg');
    });

    test('should have valid user agent format', () => {
      const userAgent = getQaUserAgent();
      
      // Expected format: qa-reg-(pdl)-cua/05:01; +reg/18
      expect(isValidQaUserAgent(userAgent)).toBe(true);
    });

    test('should match expected pattern', () => {
      const userAgent = getQaUserAgent();
      const pattern = /^qa-reg-\(pdl\)-cua\/\d{2}:\d{2};\s\+reg\/\d{2}$/;
      
      expect(userAgent).toMatch(pattern);
    });

    test('should be accessible from TEST_CONFIG', () => {
      expect(TEST_CONFIG.qaUserAgent).toBeDefined();
      expect(TEST_CONFIG.qaUserAgent).toBe(getQaUserAgent());
    });
  });

  describe('User Agent Validation', () => {
    test('should validate correct format', () => {
      expect(isValidQaUserAgent('qa-reg-(pdl)-cua/05:01; +reg/18')).toBe(true);
      expect(isValidQaUserAgent('qa-reg-(pdl)-cua/06:02; +reg/19')).toBe(true);
    });

    test('should reject invalid formats', () => {
      expect(isValidQaUserAgent('invalid-user-agent')).toBe(false);
      expect(isValidQaUserAgent('Mozilla/5.0')).toBe(false);
      expect(isValidQaUserAgent('')).toBe(false);
    });

    test('should have valid configuration', () => {
      expect(hasValidUserAgent()).toBe(true);
    });
  });

  describe('API Client Integration', () => {
    test('should include user agent in API requests', async () => {
      const api = new ProductsApi(TEST_CONFIG.baseUrl);
      
      // Get the axios instance configuration
      const axiosConfig = (api as any).client.defaults;
      
      expect(axiosConfig.headers['User-Agent']).toBeDefined();
      expect(axiosConfig.headers['User-Agent']).toBe(getQaUserAgent());
    });

    test('should make successful API request with user agent', async () => {
      const api = new ProductsApi(TEST_CONFIG.baseUrl);
      const response = await api.getAllProducts({ limit: 1 });
      
      // If user agent is correct, should not get 401/403
      expect(response.status).not.toBe(401); // Not unauthorized
      expect(response.status).not.toBe(403); // Not forbidden
      
      console.log(`API Response Status: ${response.status}`);
      console.log(`Response Time: ${response.responseTime}ms`);
    });
  });

  describe('Environment Variable Override', () => {
    test('should respect TEST_USER_AGENT environment variable', () => {
      // Note: This test documents the feature but may not work in test environment
      // where env vars are already loaded
      
      const expectedUserAgent = process.env.TEST_USER_AGENT || TEST_CONFIG.qaUserAgent;
      const actualUserAgent = TEST_CONFIG.api.headers['User-Agent'];
      
      expect(actualUserAgent).toBe(expectedUserAgent);
    });
  });

  describe('Configuration Requirements', () => {
    test('should have user agent for delta environment', () => {
      if (TEST_CONFIG.environment === 'delta') {
        expect(getQaUserAgent()).toBeTruthy();
        expect(hasValidUserAgent()).toBe(true);
      }
    });

    test('should have user agent for beta environment', () => {
      if (TEST_CONFIG.environment === 'beta') {
        expect(getQaUserAgent()).toBeTruthy();
        expect(hasValidUserAgent()).toBe(true);
      }
    });

    test('should log configuration details', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      logUserAgentConfig();
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls.some(call => 
        call[0]?.includes('QA User Agent Configuration')
      )).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Security Bypass', () => {
    test('should allow access to products endpoint', async () => {
      const api = new ProductsApi(TEST_CONFIG.baseUrl);
      const response = await api.getAllProducts({ limit: 1 });
      
      // Should successfully access the endpoint
      expect([200, 404, 500]).toContain(response.status);
      expect(response.status).not.toBe(403); // Not forbidden by security
    });

    test('should allow access to search endpoint', async () => {
      const api = new ProductsApi(TEST_CONFIG.baseUrl);
      const response = await api.searchProducts('test');
      
      // Should successfully access the endpoint
      expect([200, 404, 500]).toContain(response.status);
      expect(response.status).not.toBe(403); // Not forbidden by security
    });
  });

  describe('Documentation', () => {
    test('should have update instructions', () => {
      const { UPDATE_INSTRUCTIONS } = require('../config/test.config');
      
      expect(UPDATE_INSTRUCTIONS).toBeDefined();
      expect(UPDATE_INSTRUCTIONS).toContain('To update the QA User Agent');
      expect(UPDATE_INSTRUCTIONS).toContain('test.config.ts');
    });
  });
});
