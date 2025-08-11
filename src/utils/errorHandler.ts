/**
 * Centralized error handling utilities for RTLify GPT extension
 */

import { debugError } from './debugLogger';

export class RTLifyError extends Error {
  constructor(
    message: string,
    public readonly context?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'RTLifyError';
  }
}

/**
 * Safely executes an async function with error handling
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    debugError(`[RTLify GPT] Error in ${context}:`, error);
    
    // Send error to background script for optional user notification
    if (typeof browser !== 'undefined' && browser.runtime) {
      try {
        await browser.runtime.sendMessage({
          action: 'showToast',
          type: 'error',
          body: `Error in ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      } catch (msgError) {
        debugError('[RTLify GPT] Failed to send error message:', msgError);
      }
    }
    
    return fallback;
  }
}

/**
 * Safely executes a sync function with error handling
 */
export function safeExecuteSync<T>(
  fn: () => T,
  context: string,
  fallback?: T
): T | undefined {
  try {
    return fn();
  } catch (error) {
    debugError(`[RTLify GPT] Error in ${context}:`, error);
    return fallback;
  }
}

/**
 * Creates a debounced version of a function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Validates if an element exists and is visible
 */
export function isElementValid(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && 
         element.isConnected && 
         !element.hidden &&
         element.offsetParent !== null;
}
