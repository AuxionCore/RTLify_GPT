// DOM manipulation utilities and helpers

import { debugLog, debugError } from '../../../utils/debugLogger';

export interface TextareaMenu extends HTMLElement {
  appendChild<T extends Node>(newChild: T): T;
  insertBefore<T extends Node>(newChild: T, refChild: Node | null): T;
}

export interface AlignIconBtn extends HTMLElement {
  setAttribute(qualifiedName: string, value: string): void;
  getAttribute(qualifiedName: string): string | null;
  innerHTML: string;
  style: CSSStyleDeclaration;
  title: string;
}

/**
 * Enhanced method to find form elements using multiple selectors and attributes
 */
export function getFormElements(timeout = 15000): Promise<{
  formElement: HTMLFormElement;
  promptTextarea: HTMLTextAreaElement;
}> {
  return new Promise<{
    formElement: HTMLFormElement;
    promptTextarea: HTMLTextAreaElement;
  }>((resolve, reject) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      // Try multiple selectors for the form
      let formElement = document.querySelector(
        "form[data-type='unified-composer']"
      ) as HTMLFormElement;
      
      if (!formElement) {
        formElement = document.querySelector(
          "form:has(textarea#prompt-textarea)"
        ) as HTMLFormElement;
      }
      
      if (!formElement) {
        formElement = document.querySelector(
          "form:has(div[data-testid='composer-footer-actions'])"
        ) as HTMLFormElement;
      }

      // Try multiple selectors for the textarea
      let textarea = document.querySelector(
        "textarea#prompt-textarea"
      ) as HTMLTextAreaElement;
      
      if (!textarea) {
        textarea = document.querySelector(
          "textarea[data-id='root']"
        ) as HTMLTextAreaElement;
      }
      
      if (!textarea) {
        textarea = document.querySelector(
          "form textarea"
        ) as HTMLTextAreaElement;
      }

      if (formElement && textarea) {
        clearInterval(interval);
        resolve({
          formElement: formElement,
          promptTextarea: textarea,
        });
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(interval);
        reject("Timeout: Form element not found within timeout period");
      }
    }, 100);
  });
}

/**
 * Find the container for the alignment button
 */
export function findTextareaMenu(): TextareaMenu | null {
  // Look for the main parent container that holds all the buttons
  let textareaMenu = document.querySelector(
    'div.relative.flex.min-h-14.w-full.items-end'
  ) as TextareaMenu;

  if (!textareaMenu) {
    // Look for the specific div with absolute positioning that contains the plus button
    textareaMenu = document.querySelector(
      'div.absolute.start-2\\.5.bottom-2\\.5'
    ) as TextareaMenu;
  }

  if (!textareaMenu) {
    // Alternative selector for the same element
    textareaMenu = document.querySelector(
      'div[class*="absolute"][class*="start-2.5"][class*="bottom-2.5"]'
    ) as TextareaMenu;
  }

  if (!textareaMenu) {
    // Look for the composer footer actions container (fallback)
    textareaMenu = document.querySelector(
      'div[data-testid="composer-footer-actions"]'
    ) as TextareaMenu;
  }

  if (!textareaMenu) {
    // Fallback to finding the form and creating the container
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      textareaMenu = form.querySelector(
        'div[data-testid="composer-footer-actions"]'
      ) as TextareaMenu;
    }
  }

  // Debug logging
  if (textareaMenu) {
    debugLog("RTLify: Found textareaMenu:", textareaMenu.className);
  } else {
    debugLog("RTLify: No textareaMenu found");
  }

  return textareaMenu;
}

/**
 * Find textarea using multiple selectors
 */
export function findTextarea(): HTMLTextAreaElement | null {
  let textarea = document.querySelector("textarea#prompt-textarea") as HTMLTextAreaElement;
  
  if (!textarea) {
    textarea = document.querySelector("textarea[data-id='root']") as HTMLTextAreaElement;
  }
  
  if (!textarea) {
    const form = document.querySelector("form");
    if (form) {
      textarea = form.querySelector("textarea") as HTMLTextAreaElement;
    }
  }
  
  return textarea;
}

/**
 * Error handling function
 */
export function showError(message: string) {
  debugError("TextAlignment Error:", message);
  browser.runtime.sendMessage({
    action: "showToast",
    type: "error",
    body: message,
  }).catch(debugError);
}
