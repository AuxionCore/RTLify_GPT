// Auto-detection setup and management for text input

import { findTextarea } from './domHelpers';
import { autoDetectAlignment } from './textDirection';
import { debugLog } from '../../../utils/debugLogger';

/**
 * Handler for text input to trigger auto-detection
 */
export function createTextInputHandler(
  alignState: { current: "left" | "right" },
  updateButtonCallback: () => void
) {
  return function handleTextInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    debugLog("RTLify: Text input detected, value:", textarea.value);
    autoDetectAlignment(textarea, alignState, updateButtonCallback);
  };
}

/**
 * Function to setup auto-detection on textarea
 */
export function setupAutoDetection(
  alignState: { current: "left" | "right" },
  updateButtonCallback: () => void
) {
  const textarea = findTextarea();
  
  if (textarea) {
    // Check if this textarea already has our listener
    const hasListener = textarea.getAttribute('data-rtlify-listener') === 'true';
    
    if (!hasListener) {
      // Remove any existing listeners from all textareas to avoid duplicates
      const allTextareas = document.querySelectorAll('textarea');
      const handler = createTextInputHandler(alignState, updateButtonCallback);
      
      allTextareas.forEach(ta => {
        ta.removeEventListener("input", handler as EventListener);
        ta.removeAttribute('data-rtlify-listener');
      });
      
      // Add listener to current textarea
      textarea.addEventListener("input", handler as EventListener);
      textarea.setAttribute('data-rtlify-listener', 'true');
      
      debugLog("RTLify: Auto-detection setup complete on textarea:", textarea.id || textarea.className);
    } else {
      debugLog("RTLify: Auto-detection already setup on this textarea");
    }
  } else {
    debugLog("RTLify: Could not find textarea for auto-detection setup");
  }
}

/**
 * Set up periodic check to ensure auto-detection is working
 */
export function createAutoDetectionMonitor(
  alignState: { current: "left" | "right" },
  updateButtonCallback: () => void
): ReturnType<typeof setInterval> {
  return setInterval(() => {
    const textarea = findTextarea();
    
    if (textarea) {
      // Check if textarea has the input listener
      const hasListener = textarea.getAttribute('data-rtlify-listener') === 'true';
      if (!hasListener) {
        debugLog("RTLify: Re-setting up auto-detection on existing textarea");
        setupAutoDetection(alignState, updateButtonCallback);
      }
    }
  }, 5000); // Check every 5 seconds
}
