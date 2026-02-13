/**
 * Test Helper Utilities
 * Common helper functions used across test suites
 */

import { VueWrapper } from '@vue/test-utils';

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await sleep(interval);
  }
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for element to be visible in wrapper
 */
export async function waitForElement(
  wrapper: VueWrapper,
  selector: string,
  timeout = 5000
): Promise<void> {
  await waitFor(() => wrapper.find(selector).exists(), timeout);
}

/**
 * Simulate user typing with delay
 */
export async function typeText(
  input: HTMLInputElement,
  text: string,
  delay = 50
): Promise<void> {
  for (const char of text) {
    input.value += char;
    input.dispatchEvent(new Event('input'));
    await sleep(delay);
  }
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random string
 */
export function randomString(length = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => randomItem(chars.split(''))).join('');
}

/**
 * Generate random email
 */
export function randomEmail(): string {
  return `test-${randomString(8)}@example.com`;
}

/**
 * Generate random number in range
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format currency for testing
 */
export function formatCurrency(amount: number, currency = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object matches partial
 */
export function matchesPartial<T extends object>(
  obj: T,
  partial: Partial<T>
): boolean {
  return Object.entries(partial).every(
    ([key, value]) => obj[key as keyof T] === value
  );
}

/**
 * Retry async function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
}

/**
 * Mock console methods for testing
 */
export function mockConsole(): {
  restore: () => void;
  log: jest.Mock;
  error: jest.Mock;
  warn: jest.Mock;
} {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const log = jest.fn();
  const error = jest.fn();
  const warn = jest.fn();

  console.log = log;
  console.error = error;
  console.warn = warn;

  return {
    log,
    error,
    warn,
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    },
  };
}

/**
 * Create spy for localStorage
 */
export function mockLocalStorage(): {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
  restore: () => void;
} {
  const storage: Record<string, string> = {};

  const getItem = jest.fn((key: string) => storage[key] || null);
  const setItem = jest.fn((key: string, value: string) => {
    storage[key] = value;
  });
  const removeItem = jest.fn((key: string) => {
    delete storage[key];
  });
  const clear = jest.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  });

  Object.defineProperty(window, 'localStorage', {
    value: { getItem, setItem, removeItem, clear },
    writable: true,
  });

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    restore: () => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    },
  };
}
