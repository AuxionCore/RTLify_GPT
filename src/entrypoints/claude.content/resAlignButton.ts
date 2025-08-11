import {
  applyLTRStyleToGptResponse,
  applyRTLStyleToGptResponse,
} from "./resDirStyle";
import { debugLog } from "../../utils/debugLogger";
import { extractGptResponsesText } from "./extractTexts";

export default function addAlignButton(
  streamingElement: HTMLDivElement,
  grandchild: HTMLElement
) {
  // Chack if the button already exists
  const existingButton = streamingElement.querySelector(".align-mini-button");
  if (existingButton) {
    return; // If it exists, do nothing
  }

  const alignRightText: string = browser.i18n.getMessage("alignRight");
  const alignLeftText: string = browser.i18n.getMessage("alignLeft");

  const formatAlignRightPathEl: string = ` <path
  d="M144-744v-72h672v72H144Zm192 150v-72h480v72H336ZM144-444v-72h672v72H144Zm192 150v-72h480v72H336ZM144-144v-72h672v72H144Z"
/>`;

  const formatAlignLeftPathEl: string = `<path
  d="M144-144v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Z"
/>`;

  // Check if any child elements already have RTL styling applied
  const hasRTLElements = Array.from(streamingElement.querySelectorAll('*')).some(el => {
    const computedDirection = getComputedStyle(el as HTMLElement).getPropertyValue("direction");
    const inlineDirection = (el as HTMLElement).style.direction;
    return computedDirection === "rtl" || inlineDirection === "rtl";
  });

  // If RTL elements exist, button should show "align left" (to switch back to LTR)
  // If no RTL elements, button should show "align right" (to switch to RTL)
  const formatAlignPathEl: string = hasRTLElements
    ? formatAlignLeftPathEl
    : formatAlignRightPathEl;
  const formatAlignText: string = hasRTLElements
    ? alignLeftText
    : alignRightText;

  const alignMiniButton = document.createElement("button");
  alignMiniButton.setAttribute("aria-label", formatAlignText);
  alignMiniButton.setAttribute("title", formatAlignText);
  alignMiniButton.classList.add(
    "flex",
    "flex-row",
    "items-center",
    "gap-1.5",
    "rounded-md",
    "p-2",
    "text-sm",
    "transition",
    "text-text-300",
    "active:scale-95",
    "select-none",
    "hover:bg-bg-300",
    "py-1.5",
    "align-mini-button"
  );

  alignMiniButton.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      ${formatAlignPathEl}
    </svg>
  `;

  grandchild.prepend(alignMiniButton);

  alignMiniButton.addEventListener("click", () => {
    const contentElement = streamingElement.children[0].firstChild?.firstChild as HTMLDivElement;
    const textElements = extractGptResponsesText(contentElement)
    const currentDirection = getComputedStyle(contentElement).getPropertyValue("direction") || contentElement.style.direction || "ltr";

    debugLog("Align button clicked. Current direction:", currentDirection);
    debugLog("textElements:", textElements);
    debugLog("streamingElement:", streamingElement);

    if (currentDirection === "rtl") {
      // Currently RTL, switching to LTR
      debugLog("Switching from RTL to LTR");
      alignMiniButton.setAttribute("aria-label", alignRightText);
      alignMiniButton.setAttribute("title", alignRightText);
      alignMiniButton.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 -960 960 960"
        fill="currentColor"
      >
        ${formatAlignRightPathEl}
      </svg>
    `;
      applyLTRStyleToGptResponse(contentElement);
    } else {
      // Currently LTR or default, switching to RTL
      debugLog("Switching from LTR to RTL");
      alignMiniButton.setAttribute("aria-label", alignLeftText);
      alignMiniButton.setAttribute("title", alignLeftText);
      alignMiniButton.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 -960 960 960"
        fill="currentColor"
      >
        ${formatAlignLeftPathEl}
      </svg>
    `;
      applyRTLStyleToGptResponse(contentElement);
    }
  });
}
