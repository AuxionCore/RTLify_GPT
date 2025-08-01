// Main text alignment button functionality for ChatGPT
// Refactored into modular components for better maintainability

import { getFormElements, findTextarea, showError } from './utils/domHelpers';
import { applyRTLAlignment, applyLTRAlignment } from './utils/textDirection';
import { updateButtonState } from './utils/alignmentButton';
import { setupAutoDetection, createAutoDetectionMonitor } from './utils/autoDetection';
import { ensureButtonExists, createDOMObserver } from './utils/domObserver';

async function displayAlignmentButton() {
  // Get localized text
  const alignRightText: string = browser.i18n.getMessage("alignRight");
  const alignLeftText: string = browser.i18n.getMessage("alignLeft");

  // State management
  const alignState = { current: "left" as "left" | "right" };
  let promptTextarea: HTMLTextAreaElement;

  // Callback to update button state
  const updateButtonCallback = () => {
    updateButtonState(alignState, alignRightText, alignLeftText);
  };

  try {
    // Get stored alignment state FIRST
    try {
      const result = await browser.storage.sync.get("alignState");
      if (result.alignState) {
        alignState.current = result.alignState;
      }
    } catch (error) {
      console.error("Error getting stored alignment state:", error);
    }

    // Get form elements
    const formElements = await getFormElements();
    promptTextarea = formElements.promptTextarea;

    // Apply the saved alignment state to the textarea
    if (alignState.current === "right") {
      applyRTLAlignment(promptTextarea);
    } else {
      applyLTRAlignment(promptTextarea);
    }

    console.log("RTLify: Initial alignment applied:", alignState.current);

    // Set up auto-detection immediately on the initial textarea
    setupAutoDetection(alignState, updateButtonCallback);

    // Set up DOM observer to watch for changes
    const observer = createDOMObserver(alignState, alignRightText, alignLeftText, updateButtonCallback);

    // Start observing the entire document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Try to add button immediately if container exists
    ensureButtonExists(alignState, alignRightText, alignLeftText, updateButtonCallback);

    // Set up periodic check to ensure auto-detection is working
    const autoDetectionInterval = createAutoDetectionMonitor(alignState, updateButtonCallback);

    // Cleanup function (though it won't be called in content scripts typically)
    return () => {
      observer.disconnect();
      clearInterval(autoDetectionInterval);
    };
  } catch (error) {
    console.error(error);
    if (error === "Timeout: Form element not found within timeout period") {
      await browser.runtime.sendMessage({
        action: "showToast",
        type: "error",
        body: "An error occurred when trying to apply the text alignment feature, probably because of a update in the ChatGPT interface. We apologize for the inconvenience and are working to resolve the issue.",
      });
    }
  }
}

export default displayAlignmentButton;
