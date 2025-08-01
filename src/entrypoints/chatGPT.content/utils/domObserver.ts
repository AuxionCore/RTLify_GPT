// DOM observation and change monitoring

import { findTextareaMenu, findTextarea } from './domHelpers';
import { addAlignButton, updateButtonState } from './alignmentButton';
import { applyRTLAlignment, applyLTRAlignment } from './textDirection';
import { setupAutoDetection } from './autoDetection';

/**
 * Function to ensure button exists
 */
export function ensureButtonExists(
  alignState: { current: "left" | "right" },
  alignRightText: string,
  alignLeftText: string,
  updateButtonCallback: () => void
) {
  // Don't add button if one already exists
  if (document.getElementById("alignElement")) {
    return;
  }
  
  const textareaMenu = findTextareaMenu();
  if (textareaMenu) {
    addAlignButton(textareaMenu, alignState, alignRightText, alignLeftText, updateButtonCallback);
  }
}

/**
 * Function to apply current alignment to textarea
 */
export function applyCurrentAlignment(
  alignState: { current: "left" | "right" },
  updateButtonCallback: () => void
) {
  const textarea = findTextarea();
  
  if (textarea) {
    // Check current textarea direction and update alignState accordingly
    const currentDir = textarea.dir || textarea.style.direction || "ltr";
    if (currentDir === "rtl") {
      alignState.current = "right";
    } else {
      alignState.current = "left";
    }
    
    // Apply the stored alignment state
    if (alignState.current === "right") {
      applyRTLAlignment(textarea);
    } else {
      applyLTRAlignment(textarea);
    }
    
    // Update button to reflect current state
    updateButtonCallback();
  }
}

/**
 * Create DOM mutation observer
 */
export function createDOMObserver(
  alignState: { current: "left" | "right" },
  alignRightText: string,
  alignLeftText: string,
  updateButtonCallback: () => void
): MutationObserver {
  return new MutationObserver((mutations) => {
    let shouldCheck = false;
    let hasNewTextarea = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Check if any nodes were added or removed
        if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
          // Specifically check if a textarea was added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'TEXTAREA' || element.querySelector('textarea')) {
                console.log("RTLify: New textarea detected in DOM");
                hasNewTextarea = true;
                shouldCheck = true;
              }
              // Check if composer footer was added (indicates new chat interface)
              if (element.matches && element.matches('[data-testid="composer-footer-actions"]')) {
                console.log("RTLify: New composer footer detected");
                shouldCheck = true;
              }
            }
          });
        }
      }
    });
    
    if (shouldCheck) {
      // Use a small delay to let DOM settle
      setTimeout(() => {
        console.log("RTLify: DOM change detected, re-initializing...");
        ensureButtonExists(alignState, alignRightText, alignLeftText, updateButtonCallback);
        
        // Only re-apply alignment and setup auto-detection if there's a new textarea
        if (hasNewTextarea) {
          applyCurrentAlignment(alignState, updateButtonCallback);
          setupAutoDetection(alignState, updateButtonCallback);
        }
      }, 100);
    }
  });
}
