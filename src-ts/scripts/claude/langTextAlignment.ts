function addAlignButton(
  streamingElement: HTMLDivElement,
  grandchild: HTMLElement
) {
  // Chack if the button already exists
  const existingButton = document.getElementById("alignMiniButton");
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
  alignMiniButton.id = "alignMiniButton";
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
    "py-1.5"
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
        if (lang && rtlLanguageCodes.includes(lang)) {
          await applyRTLStyle(el);
          await applyRTLStyle(streamingElement.children[0] as HTMLDivElement);
        }

        // Display RTL switch button in case the element is not correctly aligned
        const secondChild = streamingElement.children[1] as HTMLElement;
        const grandchild = secondChild.children[0] as HTMLElement;

        addAlignButton(streamingElement, grandchild.children[0] as HTMLElement);
      }
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}

(async function () {
  function observeLangTextElement() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (
              node instanceof Element &&
              node.hasAttribute("data-test-render-count")
            ) {
              if (node instanceof HTMLDivElement) {
                handleLangTextAlignment(node as HTMLDivElement);
              }
            }

            // חיפוש בתוך אלמנטים חדשים שנוספו
            const innerMatches =
              node instanceof Element
                ? node.querySelectorAll("[data-test-render-count]")
                : null;
            innerMatches?.forEach((el) =>
              handleLangTextAlignment(el as HTMLDivElement)
            );

            // אם האלמנט הוא גם דינמי יכול להיות צורך לחכות לפני שנחפש אותו
            if (node instanceof HTMLDivElement) {
              requestAnimationFrame(() => {
                const moreMatches = node.querySelectorAll(
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

  function handleMathTextDirection(root: HTMLElement | Document = document) {
    const mathSelectors = [".katex"];
    const mainParagraphSelector = "p.whitespace-pre-wrap.break-words";

    const mathElements = root.querySelectorAll<HTMLElement>(
      mathSelectors.join(", ")
    );

    const mainParagraphs = root.querySelectorAll<HTMLElement>(
      mainParagraphSelector
    );

    mainParagraphs.forEach((el) => {
      el.style.lineHeight = "2.3";
      el.style.marginBlock = "5px";
    });

    mathElements.forEach((el) => {
      el.style.direction = "ltr";
      el.style.unicodeBidi = "isolate";
      el.style.paddingInlineStart = "5px";
      el.style.whiteSpace = "nowrap";
    });
  }

  function observeMathElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const containsMath = node.querySelector(
            ".katex, p.whitespace-pre-wrap.break-words"
          );
          if (containsMath) {
            handleMathTextDirection(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    handleMathTextDirection();
  }

  // Start observing for new elements
  observeLangTextElement();
  observeMathElements();
})();
