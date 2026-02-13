import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import QA_CONFIG from '@/config/qa.config';

/**
 * QA API Service for testing Stop & Shop endpoints
 * Uses custom user agent to avoid being blocked
 */
class QAApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: QA_CONFIG.baseUrl,
      timeout: QA_CONFIG.timeout,
      headers: {
        'User-Agent': QA_CONFIG.userAgent,
        'Accept': 'application/json, text/html, */*',
        'Accept-Encoding': QA_CONFIG.acceptedEncodings.join(', '),
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[QA] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[QA] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[QA] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[QA] Response error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Test endpoint availability and response time
   */
  async testEndpoint(path: string): Promise<{
    success: boolean;
    status: number;
    responseTime: number;
    data?: any;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      const response = await this.client.get(path);
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        status: response.status,
        responseTime,
        data: response.data,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        status: error.response?.status || 0,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Test product search functionality
   */
  async testProductSearch(query: string): Promise<{
    success: boolean;
    productsFound: number;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      // Adjust the path based on actual Stop & Shop API structure
      const response = await this.client.get('/api/products/search', {
        params: { q: query },
      });
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        productsFound: response.data?.length || 0,
        responseTime,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        productsFound: 0,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Test page load
   */
  async testPageLoad(path: string = '/'): Promise<{
    success: boolean;
    status: number;
    responseTime: number;
    contentLength: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      const response = await this.client.get(path);
      const responseTime = Date.now() - startTime;
      const contentLength = response.headers['content-length'] || 0;

      return {
        success: true,
        status: response.status,
        responseTime,
        contentLength: parseInt(contentLength as string),
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        status: error.response?.status || 0,
        responseTime,
        contentLength: 0,
        error: error.message,
      };
    }
  }

  /**
   * Custom request with retry logic
   */
  async requestWithRetry(config: AxiosRequestConfig, retries = QA_CONFIG.retryAttempts): Promise<any> {
    try {
      return await this.client.request(config);
    } catch (error) {
      if (retries > 0) {
        console.log(`[QA] Retrying... ${retries} attempts left`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        return this.requestWithRetry(config, retries - 1);
      }
      throw error;
    }
  }
}

export default new QAApiService();
