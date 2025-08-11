import {
  applyLTRStyleToGptResponse,
  applyRTLStyleToGptResponse,
} from "./resDirStyle";

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

  const formatAlignPathEl: string =
    getComputedStyle(
      streamingElement.children[0] as HTMLDivElement
    ).getPropertyValue("direction") === "rtl"
      ? formatAlignLeftPathEl
      : formatAlignRightPathEl;
  const formatAlignText: string =
    getComputedStyle(
      streamingElement.children[0] as HTMLDivElement
    ).getPropertyValue("direction") === "rtl"
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
    const currentDirection = (streamingElement.children[0] as HTMLDivElement)
      .style.direction;

    if (currentDirection === "rtl") {
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
      applyLTRStyleToGptResponse(
        streamingElement.children[0] as HTMLDivElement
      );
    }

    if (currentDirection === "ltr") {
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
      applyRTLStyleToGptResponse(
        streamingElement.children[0] as HTMLDivElement
      );
    }
  });
}
