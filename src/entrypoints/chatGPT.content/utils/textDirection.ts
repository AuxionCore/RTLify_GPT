// Text direction detection and auto-alignment logic

/**
 * Function to detect if text is RTL (Hebrew, Arabic, Persian)
 */
export function isRTLText(text: string): boolean {
  // Hebrew characters range
  const hebrewPattern = /[\u0590-\u05FF]/;
  // Arabic characters range  
  const arabicPattern = /[\u0600-\u06FF]/;
  // Persian/Farsi characters range
  const persianPattern = /[\u06A0-\u06FF]/;
  
  const isRTL = hebrewPattern.test(text) || arabicPattern.test(text) || persianPattern.test(text);
  console.log("RTLify: isRTLText check for:", text, "result:", isRTL);
  
  return isRTL;
}

/**
 * Apply RTL alignment to textarea
 */
export function applyRTLAlignment(textarea: HTMLTextAreaElement) {
  textarea.style.setProperty("direction", "rtl", "important");
  textarea.style.setProperty("text-align", "right", "important");
  textarea.setAttribute("dir", "rtl");
  
  // Also apply to any parent containers that might affect alignment
  const container = textarea.closest('div');
  if (container) {
    container.style.setProperty("direction", "rtl", "important");
  }
}

/**
 * Apply LTR alignment to textarea
 */
export function applyLTRAlignment(textarea: HTMLTextAreaElement) {
  textarea.style.setProperty("direction", "ltr", "important");
  textarea.style.setProperty("text-align", "left", "important");
  textarea.setAttribute("dir", "ltr");
  
  // Also apply to any parent containers that might affect alignment
  const container = textarea.closest('div');
  if (container) {
    container.style.setProperty("direction", "ltr", "important");
  }
}

/**
 * Function to auto-detect and apply alignment based on text input
 */
export function autoDetectAlignment(
  textarea: HTMLTextAreaElement,
  alignState: { current: "left" | "right" },
  updateButtonCallback: () => void
) {
  const text = textarea.value.trim();
  console.log("RTLify: Auto-detect called with text:", text, "length:", text.length);
  
  if (text.length > 0) {
    const shouldBeRTL = isRTLText(text);
    const currentlyRTL = alignState.current === "right";
    
    console.log("RTLify: Text analysis - shouldBeRTL:", shouldBeRTL, "currentlyRTL:", currentlyRTL);
    
    if (shouldBeRTL && !currentlyRTL) {
      // Auto-switch to RTL
      console.log("RTLify: Auto-switching to RTL alignment");
      alignState.current = "right";
      applyRTLAlignment(textarea);
      updateButtonCallback();
      browser.storage.sync.set({ alignState: alignState.current });
      console.log("RTLify: Auto-detected RTL text, switched to right alignment");
    } else if (!shouldBeRTL && currentlyRTL && text.length > 0) {
      // Auto-switch to LTR only if there's actual LTR text
      const hasLTRText = /[a-zA-Z]/.test(text);
      console.log("RTLify: Checking for LTR text, hasLTRText:", hasLTRText);
      if (hasLTRText) {
        console.log("RTLify: Auto-switching to LTR alignment");
        alignState.current = "left";
        applyLTRAlignment(textarea);
        updateButtonCallback();
        browser.storage.sync.set({ alignState: alignState.current });
        console.log("RTLify: Auto-detected LTR text, switched to left alignment");
      }
    }
  }
}
