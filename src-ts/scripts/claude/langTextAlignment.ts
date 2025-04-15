function addAlignButton(
  streamingElement: HTMLDivElement,
  grandchild: HTMLElement
) {
  // Chack if the button already exists
  const existingButton = streamingElement.querySelector(".align-mini-button");
  if (existingButton) {
    return; // If it exists, do nothing
  }

  const alignRightText: string = chrome.i18n.getMessage("alignRight");
  const alignLeftText: string = chrome.i18n.getMessage("alignLeft");

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
    const currentDirection = getComputedStyle(
      streamingElement.children[0] as HTMLDivElement
    ).direction;

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
      applyLTRStyle(streamingElement.children[0] as HTMLDivElement);
    } else {
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
      applyRTLStyle(streamingElement.children[0] as HTMLDivElement);
    }
  });
}

async function detectLanguage(inputText: string) {
  const result = await chrome.i18n.detectLanguage(inputText);

  if (result && result.languages) {
    const lang = result.languages[0].language;
    return lang;
  } else {
    throw new Error("Language detection failed");
  }
}

function extractParagraphTexts(container: HTMLElement) {
  const paragraphs = container.querySelectorAll<HTMLParagraphElement>(
    "p.whitespace-pre-wrap.break-words"
  );

  const texts: string[] = [];
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (text) {
      texts.push(text);
    }
  });

  return texts;
}

async function applyRTLStyle(el: HTMLDivElement) {
  el.style.setProperty("direction", "rtl");
  el.style.setProperty("text-align", el.style.direction);
}

async function applyLTRStyle(el: HTMLDivElement) {
  el.style.setProperty("direction", "ltr");
}

async function handleLangTextAlignment(el: HTMLDivElement) {
  const streamingElement = el.querySelector(
    "[data-is-streaming]"
  ) as HTMLDivElement;

  const rtlLanguageCodes = ["iw", "he", "ar", "fa"];

  let allTexts: string[] = [];
  for (const child of el.children) {
    const texts = extractParagraphTexts(child as HTMLElement);
    allTexts.push(...texts);
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const lang = await detectLanguage(combinedText);
      if (streamingElement) {
          console.log("Streaming element:", streamingElement);
        if (lang && rtlLanguageCodes.includes(lang)) {
          await applyRTLStyle(streamingElement.children[0] as HTMLDivElement);
        }

        // Display RTL switch button in case the element is not correctly aligned
        const secondChild = streamingElement.children[1] as HTMLElement;
        const grandchild = secondChild.children[0] as HTMLElement;
        console.log("Grandchild element:", grandchild.children[0]);

        addAlignButton(streamingElement, grandchild.children[0] as HTMLElement);
      } else {
        if (lang && rtlLanguageCodes.includes(lang)) {
          await applyRTLStyle(el);
        }
      }
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}

function observeStreamingAttribute(el: HTMLElement, parentEl: HTMLElement) {
  const attrObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-is-streaming"
      ) {
        const val = el.getAttribute("data-is-streaming");

        if (val === "false") {
          attrObserver.disconnect();
          handleLangTextAlignment(parentEl as HTMLDivElement);
        }
      }
    });
  });

  attrObserver.observe(el, {
    attributes: true,
    attributeFilter: ["data-is-streaming"],
  });
}

(async function () {
  function observeLangTextElement() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLDivElement;
            const dataTestRenderCount = element.hasAttribute(
              "data-test-render-count"
            )
              ? element
              : null;
            const dataIsStreaming = element.hasAttribute("data-is-streaming")
              ? element
              : null;

            if (dataTestRenderCount) {
              handleLangTextAlignment(dataTestRenderCount);
            }

            const innerMatches = element.querySelectorAll(
              "[data-test-render-count]"
            );
            innerMatches.forEach((el) => {
              handleLangTextAlignment(el as HTMLDivElement);
            });

            if (dataIsStreaming) {
              console.log("Streaming element added:", dataIsStreaming);
              observeStreamingAttribute(
                dataIsStreaming as HTMLElement,
                dataTestRenderCount as HTMLElement
              );
            }

            const streamingInner = element.querySelectorAll(
              "[data-is-streaming]"
            );
            streamingInner.forEach((streamEl) => {
              observeStreamingAttribute(
                streamEl as HTMLElement,
                dataTestRenderCount as HTMLElement
              );
            });

            if (element instanceof HTMLDivElement) {
              requestAnimationFrame(() => {
                const moreMatches = element.querySelectorAll(
                  "[data-test-render-count]"
                );
                moreMatches.forEach((el) =>
                  handleLangTextAlignment(el as HTMLDivElement)
                );
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  // Start observing for new elements
  observeLangTextElement();
})();
