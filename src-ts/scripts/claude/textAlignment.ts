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

async function applyRTLStyleToUserPrompts(el: HTMLDivElement) {
  const userMessages = el.querySelector<HTMLDivElement>(
    "[data-testid=user-message]"
  );
  userMessages?.style.setProperty("direction", "rtl");
}

function applyRTLStyleToGptResponse(gptResponseEl: HTMLDivElement) {
  gptResponseEl.style.setProperty("direction", "rtl");

  // Set the text direction for math content elements
  const elementsContainingMath = gptResponseEl.querySelectorAll<HTMLElement>(
    "p.whitespace-pre-wrap.break-words, li.whitespace-normal.break-words, div.math.math-display, h3, h4"
  );

  elementsContainingMath.forEach((el) => {
    el.style.setProperty("unicode-bidi", "plaintext");
  });

  // Set the text direction for all dynamic paragraphs
  for (const el of elementsContainingMath) {
    // Katex elements lode in the DOM after the math elements are added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const mathElement = el.querySelector(".katex") as HTMLSpanElement;
          if (mathElement) {
            handleMathTextDirection(el);
          } else {
            el.style.setProperty("unicode-bidi", "plaintext");
          }
        }
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const mathElements = node.matches?.("div.math.math-display")
          ? [node]
          : Array.from(node.querySelectorAll("div.math.math-display"));

        for (const el of mathElements) {
          handleMathTextDirection(el as HTMLDivElement);
        }
      }
    }
  });

  observer.observe(gptResponseEl, {
    childList: true,
    subtree: true,
  });
}

function applyLTRStyleToGptResponse(gptResponseEl: HTMLDivElement) {
  gptResponseEl.style.setProperty("direction", "ltr");

  const elementsContainingMath = gptResponseEl.querySelectorAll<HTMLElement>(
    "p.whitespace-pre-wrap.break-words, li.whitespace-normal.break-words, div.math.math-display, h3, h4"
  );

  elementsContainingMath.forEach((el) => {
    el.style.setProperty("unicode-bidi", "initial");
  });
}

async function handleUserPromptsAlignment(element: HTMLDivElement) {
  const rtlLanguageCodes = ["iw", "he", "ar", "fa"];

  let allTexts: string[] = [];
  for (const child of element.children) {
    const texts = extractParagraphTexts(child as HTMLElement);
    allTexts.push(...texts);
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const lang = await detectLanguage(combinedText);

      if (lang && rtlLanguageCodes.includes(lang)) {
        await applyRTLStyleToUserPrompts(element);
      }
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}

async function handleGptResponseAlignment(element: HTMLDivElement) {
  const rtlLanguageCodes = ["iw", "he", "ar", "fa"];

  let allTexts: string[] = [];
  for (const child of element.children) {
    const texts = extractParagraphTexts(child as HTMLElement);
    allTexts.push(...texts);
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const lang = await detectLanguage(combinedText);

      if (lang && rtlLanguageCodes.includes(lang)) {
        await applyRTLStyleToGptResponse(element.children[0] as HTMLDivElement);
      }

      // Display RTL switch button in case the element is not correctly aligned
      const secondChild = element.children[1] as HTMLElement;
      const grandchild = secondChild.children[0] as HTMLElement;

      addAlignButton(element, grandchild.children[0] as HTMLElement);
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}

function observeStreamingAttribute(el: HTMLElement) {
  console.log("Streaming started:", el);
  const attrObserver = new MutationObserver((mutations) => {
    mutations.forEach(async (mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-is-streaming"
      ) {
        const val = el.getAttribute("data-is-streaming");
        console.log("Streaming ended:", el);
        if (val === "false") {
          // console.log("Streaming ended:", el);
          attrObserver.disconnect();
          await handleGptResponseAlignment(el as HTMLDivElement);
        }
      }
    });
  });

  attrObserver.observe(el, {
    attributes: true,
    attributeFilter: ["data-is-streaming"],
  });
}

function handleMathTextDirection(root: HTMLElement) {
  const mathSelectors = [".katex"];

  const mathElements = root.querySelectorAll<HTMLElement>(
    mathSelectors.join(", ")
  );

  root.style.lineHeight = "2";
  root.style.marginBlock = "2px";

  mathElements.forEach((el) => {
    el.style.direction = "ltr";
    el.style.unicodeBidi = "plaintext";
    el.style.paddingInlineStart = "5px";
    el.style.whiteSpace = "nowrap";
  });
}

(async function () {
  // Await 2 seconds to make sure the page is loaded
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const elements = document.querySelectorAll<HTMLElement>(
    "[data-test-render-count]"
  );

  elements.forEach((el) => {
    const dataIsNotStreaming = el.querySelector(
      "[data-is-streaming='false']"
    ) as HTMLDivElement;

    if (dataIsNotStreaming) {
      handleGptResponseAlignment(dataIsNotStreaming as HTMLDivElement);
    } else {
      handleUserPromptsAlignment(el as HTMLDivElement);
    }
  });

  function observeLangTextElement() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLDivElement;

            // Handle the case when the element is added to the DOM
            if (element.hasAttribute("data-test-render-count")) {
              console.log(
                "[observer] Element with data-test-render-count added:",
                element
              );

              waitForStreamingElement(
                element,
                (streamingElement) => {
                  const isStreaming =
                    streamingElement.getAttribute("data-is-streaming");
                  console.log(
                    "[observer] Found streaming element. Streaming:",
                    isStreaming
                  );

                  if (isStreaming === "false") {
                    console.log(
                      "[observer] Already finished streaming. Waiting for content..."
                    );
                    waitForChildContent(streamingElement, () => {
                      console.log(
                        "[childContentObserver] Content loaded. Aligning..."
                      );
                      handleGptResponseAlignment(
                        streamingElement as HTMLDivElement
                      );
                    });
                  } else {
                    const streamingObserver = new MutationObserver(
                      (attrMutations) => {
                        attrMutations.forEach((attrMutation) => {
                          if (
                            attrMutation.type === "attributes" &&
                            attrMutation.attributeName === "data-is-streaming"
                          ) {
                            const target =
                              attrMutation.target as HTMLDivElement;
                            const newValue =
                              target.getAttribute("data-is-streaming");
                            console.log(
                              "[streamingObserver] data-is-streaming changed to:",
                              newValue
                            );

                            if (newValue === "false") {
                              console.log(
                                "[streamingObserver] Streaming finished. Waiting for content..."
                              );
                              streamingObserver.disconnect();

                              waitForChildContent(target, () => {
                                console.log(
                                  "[childContentObserver] Content loaded. Aligning..."
                                );
                                handleGptResponseAlignment(target);
                              });
                            }
                          }
                        });
                      }
                    );

                    streamingObserver.observe(streamingElement, {
                      attributes: true,
                      attributeFilter: ["data-is-streaming"],
                    });
                  }
                },
                () => {
                  // fallback אם בכלל לא נוסף streamingElement
                  console.log(
                    "[observer] No streaming element found. Handling user prompt instead."
                  );
                  handleUserPromptsAlignment(element);
                }
              );
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("[observer] Started observing DOM mutations.");
  }

  // Wait for the streaming element to be added to the DOM
  function waitForStreamingElement(
    container: HTMLElement,
    callback: (el: HTMLElement) => void,
    onTimeout?: () => void
  ) {
    const existing = container.querySelector(
      "[data-is-streaming]"
    ) as HTMLElement;
    if (existing) {
      callback(existing);
      return;
    }

    const timeout = setTimeout(() => {
      observer.disconnect();
      onTimeout?.();
    }, 5000); // נגיד אחרי 5 שניות אם לא הגיע, נמשיך הלאה

    const observer = new MutationObserver(() => {
      const el = container.querySelector("[data-is-streaming]") as HTMLElement;
      if (el) {
        clearTimeout(timeout);
        observer.disconnect();
        callback(el);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  function waitForChildContent(target: HTMLElement, callback: () => void) {
    if (target.childNodes.length > 0) {
      callback();
      return;
    }

    const childObserver = new MutationObserver(() => {
      if (target.childNodes.length > 0) {
        childObserver.disconnect();
        callback();
      }
    });

    childObserver.observe(target, {
      childList: true,
      subtree: false,
    });
  }

  observeLangTextElement();
})();
