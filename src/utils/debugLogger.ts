/**
 * Debug logger utility that only logs when in debug mode
 */

// Check if we're in debug mode by looking at the WXT config
// In development mode or when we explicitly want debugging, we enable logs
const isDebugMode = () => {
  // Try to detect if we're in development context
  try {
    // Check various development indicators
    return (
      typeof globalThis !== 'undefined' && 
      (
        // Development environment checks
        process?.env?.NODE_ENV === 'development' ||
        import.meta?.env?.DEV ||
        // Browser extension specific checks
        window?.location?.protocol === 'chrome-extension:' ||
        window?.location?.protocol === 'moz-extension:' ||
        // Check if browser.runtime.getManifest exists and is in development
        (typeof browser !== 'undefined' && browser?.runtime?.getManifest?.()?.version?.includes?.('dev'))
      )
    );
  } catch {
    // If any check fails, default to false (production mode)
    return false;
  }
};

export function debugLog(...args: any[]) {
  if (isDebugMode()) {
    console.log('[DEBUG]', ...args);
  }
}

export function debugError(...args: any[]) {
  if (isDebugMode()) {
    console.error('[DEBUG]', ...args);
  }
}

export function debugWarn(...args: any[]) {
  if (isDebugMode()) {
    console.warn('[DEBUG]', ...args);
  }
}
