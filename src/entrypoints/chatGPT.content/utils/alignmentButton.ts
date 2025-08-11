// Alignment button creation and management

import { AlignIconBtn, TextareaMenu, findTextarea } from './domHelpers';
import { applyRTLAlignment, applyLTRAlignment } from './textDirection';
import { setupAutoDetection } from './autoDetection';

/**
 * SVG paths for alignment icons
 */
export const formatAlignRightPathEl = ` <path
  fill-rule="evenodd"
  clip-rule="evenodd"
  fill="currentColor"
  d="M144-744v-72h672v72H144Zm192 150v-72h480v72H336ZM144-444v-72h672v72H144Zm192 150v-72h480v72H336ZM144-144v-72h672v72H144Z"
/>`;

export const formatAlignLeftPathEl = ` <path
  fill-rule="evenodd"
  clip-rule="evenodd"
  fill="currentColor"
  d="M144-144v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Z"
/>`;

/**
 * Function to update button state based on current alignment
 */
export function updateButtonState(
  alignState: { current: "left" | "right" },
  alignRightText: string,
  alignLeftText: string
) {
  const button = document.getElementById("alignElement") as AlignIconBtn;
  if (button) {
    let formatAlignText = alignState.current === "left" ? alignRightText : alignLeftText;
    let formatAlignPathEl = alignState.current === "left" ? formatAlignRightPathEl : formatAlignLeftPathEl;
    
    button.setAttribute("aria-label", formatAlignText);
    button.setAttribute("title", formatAlignText);
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon">
        ${formatAlignPathEl}
      </svg>
    `;
  }
}

/**
 * Toggle alignment function
 */
export async function toggleAlignment(
  alignElement: AlignIconBtn,
  event: MouseEvent,
  alignState: { current: "left" | "right" },
  alignRightText: string,
  alignLeftText: string
) {
  try {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("RTLify: Toggle started, current state:", alignState.current);
    
    // Clear any active states or focus that might cause color changes
    alignElement.blur();

    const textarea = findTextarea();
    
    if (!textarea) {
      console.error("RTLify: Textarea not found");
      return;
    }

    console.log("RTLify: Found textarea:", textarea);
    console.log("RTLify: Current textarea styles before change:", {
      direction: textarea.style.direction,
      textAlign: textarea.style.textAlign,
      dir: textarea.dir
    });

    if (alignState.current === "left") {
      // Set RTL alignment
      console.log("RTLify: Setting RTL alignment");
      applyRTLAlignment(textarea);
      alignState.current = "right";

      alignElement.innerHTML = `
        <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon">
          ${formatAlignLeftPathEl}
        </svg>
      `;
      alignElement.title = alignLeftText;
      alignElement.setAttribute("aria-label", alignLeftText);
    } else {
      // Set LTR alignment
      console.log("RTLify: Setting LTR alignment");
      applyLTRAlignment(textarea);
      alignState.current = "left";

      alignElement.innerHTML = `
        <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon">
          ${formatAlignRightPathEl}
        </svg>
      `;
      alignElement.title = alignRightText;
      alignElement.setAttribute("aria-label", alignRightText);
    }
    
    console.log("RTLify: New state:", alignState.current);
    console.log("RTLify: Textarea styles after change:", {
      direction: textarea.style.direction,
      textAlign: textarea.style.textAlign,
      dir: textarea.dir
    });
    
    // Force a focus and re-focus to make sure changes apply
    textarea.blur();
    setTimeout(() => {
      textarea.focus();
    }, 10);
    
    // Ensure button maintains its original styling
    alignElement.className = "composer-btn";
    
    try {
      await browser.storage.sync.set({ alignState: alignState.current });
      console.log("RTLify: State saved to storage");
    } catch (error) {
      console.error("Storage error:", error);
    }
  } catch (error) {
    console.error("Error in toggleAlignment:", error);
  }
}

/**
 * Add alignment button function
 */
export function addAlignButton(
  textareaMenu: TextareaMenu,
  alignState: { current: "left" | "right" },
  alignRightText: string,
  alignLeftText: string,
  updateButtonCallback: () => void
): AlignIconBtn | null {
  // Check if button already exists
  if (document.getElementById("alignElement")) {
    return null;
  }

  const buttonElement = document.createElement("button");
  buttonElement.id = "alignElement";
  buttonElement.type = "button";

  // Set the correct text and icon based on current state
  let formatAlignText = alignState.current === "left" ? alignRightText : alignLeftText;
  let formatAlignPathEl = alignState.current === "left" ? formatAlignRightPathEl : formatAlignLeftPathEl;

  // Use exact ChatGPT styling with composer-btn class
  buttonElement.className = "composer-btn";
  buttonElement.setAttribute("aria-label", formatAlignText);
  buttonElement.setAttribute("title", formatAlignText);
  
  buttonElement.innerHTML = `
    <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon">
      ${formatAlignPathEl}
    </svg>
  `;

  // Create a separate div with absolute positioning for our button
  const alignButtonContainer = document.createElement("div");
  alignButtonContainer.className = "absolute bottom-2.5";
  alignButtonContainer.style.cssText = `
    left: calc(2.5rem + 8px);
    z-index: 10;
  `;
  
  alignButtonContainer.appendChild(buttonElement);

  // Add margin to textarea container to make room for our button
  const textareaContainer = document.querySelector('textarea')?.parentElement
  if (textareaContainer) {
    // Add left margin to prevent overlap with our button
    (textareaContainer as HTMLElement).style.marginLeft = 'calc(5*var(--spacing) + 30px)';
    console.log("RTLify: Added margin to textarea container");
  }

  // Insert our container after the plus button container
  const plusButtonContainer = textareaMenu;
  if (plusButtonContainer && plusButtonContainer.parentNode) {
    plusButtonContainer.parentNode.insertBefore(alignButtonContainer, plusButtonContainer.nextSibling);
    console.log("RTLify: Button container inserted after plus button container");
  } else {
    // Fallback: find the parent container and append
    const parentContainer = document.querySelector('div.relative.flex.min-h-14.w-full.items-end');
    if (parentContainer) {
      parentContainer.appendChild(alignButtonContainer);
      console.log("RTLify: Button container appended to parent");
    }
  }

  buttonElement.addEventListener("click", async (event: MouseEvent) => {
    console.log("RTLify: Button clicked, current state:", alignState.current);
    await toggleAlignment(buttonElement as AlignIconBtn, event, alignState, alignRightText, alignLeftText);
  });
  
  // Add auto-detection to the textarea
  setupAutoDetection(alignState, updateButtonCallback);
  
  console.log("RTLify: Text alignment button added with state:", alignState.current);
  
  return buttonElement as AlignIconBtn;
}
