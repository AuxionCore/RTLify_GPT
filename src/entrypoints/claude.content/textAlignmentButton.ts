export default async function displayAlignmentButton() {
  interface TextareaMenu extends HTMLElement {
    appendChild<T extends Node>(newChild: T): T;
  }

  interface AlignIconBtn extends HTMLDivElement {
    setAttribute(qualifiedName: string, value: string): void;
    getAttribute(qualifiedName: string): string | null;
    innerHTML: string;
    style: CSSStyleDeclaration;
  }

  const alignRightText: string = browser.i18n.getMessage("alignRight");
  const alignLeftText: string = browser.i18n.getMessage("alignLeft");

  const formatAlignRightPathEl: string = ` <path
  fill-rule="evenodd"
  clip-rule="evenodd"
  fill="currentColor"
  d="M144-744v-72h672v72H144Zm192 150v-72h480v72H336ZM144-444v-72h672v72H144Zm192 150v-72h480v72H336ZM144-144v-72h672v72H144Z"
/>`;

  const formatAlignLeftPathEl: string = ` <path
  fill-rule="evenodd"
  clip-rule="evenodd"
  fill="currentColor"
  d="M144-144v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Z"
/>`;

  try {
    // Get the form element with the data-type="unified-composer" attribute
    function getFormElements(timeout = 30000): Promise<{
      fieldsetElement: HTMLFieldSetElement;
      promptTextarea: HTMLTextAreaElement;
    }> {
      return new Promise<{
        fieldsetElement: HTMLFieldSetElement;
        promptTextarea: HTMLTextAreaElement;
      }>((resolve, reject) => {
        const startTime = Date.now();

        const interval = setInterval(() => {
          const fieldsetElement = document.querySelector("fieldset");

          if (fieldsetElement) {
            const promptTextarea = fieldsetElement.querySelector(
              "[contenteditable]"
            ) as HTMLTextAreaElement;
            if (promptTextarea) {
              clearInterval(interval);
              resolve({
                fieldsetElement: fieldsetElement as HTMLFieldSetElement,
                promptTextarea: promptTextarea as HTMLTextAreaElement,
              });
            }
          }

          if (Date.now() - startTime >= timeout) {
            clearInterval(interval);
            reject(
              new Error("Timeout: Form element not found within 30 seconds")
            );
          }
        }, 500);
      });
    }

    async function getAlignState(): Promise<"left" | "right"> {
      try {
        const result = await browser.storage.sync.get("alignState");

        if (result.alignState) {
          return result.alignState;
        } else {
          await browser.storage.sync.set({ alignState: "left" });
          return "left";
        }
      } catch (error) {
        console.error(error);
        return "left";
      }
    }

    let alignState = await getAlignState();
    const { fieldsetElement, promptTextarea } = await getFormElements();

    if (!promptTextarea || !fieldsetElement) {
      console.error(
        "form Element not found: " + promptTextarea,
        fieldsetElement
      );
    }

    promptTextarea.style.direction = alignState === "left" ? "ltr" : "rtl";
    promptTextarea.style.textAlign = alignState === "left" ? "left" : "right";

    const textareaMenu = fieldsetElement.querySelector(
      ".relative.flex-1.flex.items-center.gap-2.shrink.min-w-0"
    );

    let alignElement: AlignIconBtn | null = null;
    if (textareaMenu) {
      alignElement = textareaMenu.querySelector(
        "#alignElement"
      ) as AlignIconBtn;

      if (!alignElement) {
        addAlignButton(textareaMenu as TextareaMenu);
      }
    }

    async function toggleAlignment(
      alignElement: AlignIconBtn,
      event: MouseEvent
    ) {
      event.preventDefault();
      promptTextarea.removeEventListener("input", handleInputEvent);

      const alignButton = alignElement.querySelector(
        "#alignButton"
      ) as HTMLDivElement;

      const svgIcon = alignElement.querySelector("svg") as SVGElement;

      alignState = alignState === "left" ? "right" : "left";
      const newTitle = alignState === "left" ? alignRightText : alignLeftText;
      const newSvgPathEl =
        alignState === "left" ? formatAlignRightPathEl : formatAlignLeftPathEl;

      alignButton.setAttribute("title", newTitle);
      alignButton.setAttribute("aria-label", newTitle);
      svgIcon.innerHTML = newSvgPathEl;

      promptTextarea.style.direction = alignState === "left" ? "ltr" : "rtl";
      promptTextarea.style.textAlign = alignState === "left" ? "left" : "right";

      try {
        await browser.storage.sync.set({ alignState: alignState });
      } catch (error) {
        console.error(error);
      }
    }

    function addAlignButton(textareaMenu: TextareaMenu) {
      alignElement = document.createElement("div") as AlignIconBtn;
      alignElement.id = "alignElement";
      alignElement.classList.add("shrink-0", "relative");

      let formatAlignText =
        alignState === "left" ? alignRightText : alignLeftText;
      let formatAlignPathEl =
        alignState === "left" ? formatAlignRightPathEl : formatAlignLeftPathEl;

      alignElement.innerHTML = `
        <div class="flex items-center">
          <div class="flex shrink-0" style="opacity: 1; transform: none">
            <button
              class="inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100"
              type="button"
              id="alignButton"
              aria-label="${formatAlignText}"
              title="${formatAlignText}"
            >
              <div class="flex flex-row items-center justify-center gap-1">
                <div style="transform: none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 -960 960 960"
                  >
                    ${formatAlignPathEl}
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      `;

      textareaMenu.prepend(alignElement);

      alignElement.addEventListener("click", async (event: MouseEvent) => {
        await toggleAlignment(alignElement as AlignIconBtn, event);
      });
    }

    function detectDirectionFromChar(char: string): "ltr" | "rtl" {
      // Hebrew characters
      const HeRegex = /[\u0590-\u05FF]/;
      // Arabic characters
      const arRegex = /[\u0600-\u06FF]/;
      // Persian characters
      const faRegex = /[\u0750-\u077F]/;
      return HeRegex.test(char) || arRegex.test(char) || faRegex.test(char)
        ? "rtl"
        : "ltr";
    }

    async function setAlignment(newAlign: "left" | "right") {
      alignState = newAlign;
      promptTextarea.style.direction = alignState === "left" ? "ltr" : "rtl";
      promptTextarea.style.textAlign = alignState === "left" ? "left" : "right";

      if (alignElement) {
        const alignButton = alignElement.querySelector(
          "#alignButton"
        ) as HTMLDivElement;
        const svgIcon = alignElement.querySelector("svg") as SVGElement;

        const newTitle = alignState === "left" ? alignRightText : alignLeftText;
        const newSvgPath =
          alignState === "left"
            ? formatAlignRightPathEl
            : formatAlignLeftPathEl;

        alignButton.setAttribute("title", newTitle);
        alignButton.setAttribute("aria-label", newTitle);
        svgIcon.innerHTML = newSvgPath;
      }

      try {
        await browser.storage.sync.set({ alignState: alignState });
      } catch (error) {
        console.error(error);
      }
    }

    let firstCharDetected = false;

    async function handleInputEvent(e: Event) {
      e.preventDefault();
      let contentElement: HTMLElement | null;

      if ((e.target as HTMLElement).tagName === "P") {
        contentElement = e.target as HTMLElement;
      } else {
        contentElement = promptTextarea.querySelector("p");
      }

      if (contentElement) {
        const text = contentElement.innerText.trim();

        if (text.length === 0) {
          firstCharDetected = false;
          return;
        }

        if (firstCharDetected) return;

        for (let char of text) {
          const detectedDirection = detectDirectionFromChar(char);

          if (detectedDirection) {
            await setAlignment(detectedDirection === "rtl" ? "right" : "left");
            firstCharDetected = true;
            break;
          }
        }
      }
    }

    function handlePasteEvent(e: ClipboardEvent) {
      if (
        promptTextarea.textContent?.trim() ===
        e.clipboardData?.getData("text/plain").trim()
      ) {
        setTimeout(() => handleInputEvent(e), 0);
      } else {
        return;
      }
    }

    function handleCutEvent(e: ClipboardEvent) {
      const isPromptTextareaEmpty = promptTextarea.textContent?.trim() === "";
      if (isPromptTextareaEmpty) {
        setTimeout(() => handleInputEvent(e), 0);
      } else {
        return;
      }
    }

    function handleDeleteKeyEvent(e: KeyboardEvent) {
      if (e.key === "Backspace" || e.key === "Delete") {
        const isPromptTextareaEmpty = promptTextarea.textContent?.trim() === "";
        if (isPromptTextareaEmpty) {
          setTimeout(() => handleInputEvent(e), 0);
        } else {
          return;
        }
      }
    }

    promptTextarea.addEventListener("input", handleInputEvent);
    promptTextarea.addEventListener("paste", handlePasteEvent);
    promptTextarea.addEventListener("cut", handleCutEvent);
    promptTextarea.addEventListener("keydown", handleDeleteKeyEvent);

    // const observer = new MutationObserver((mutations) => {
    //   let hasChanged = false;

    //   mutations.forEach(async (mutation) => {
    //     if (
    //       mutation.type === "childList" ||
    //       mutation.type === "characterData"
    //     ) {
    //       const paragraphs = promptTextarea.querySelectorAll("p");

    //       paragraphs.forEach((contentElement) => {
    //         const text = contentElement.innerText.trim();
    //         if (text.length > 0) {

    //           const firstChar = text.charAt(0);
    //           const detectedDirection = detectDirectionFromChar(firstChar);

    //           const newDirection = detectedDirection;
    //           const newAlign = detectedDirection === "rtl" ? "right" : "left";

    //           // Check if the direction or alignment has changed
    //           if (
    //             contentElement.style.direction !== newDirection ||
    //             contentElement.style.textAlign !== newAlign
    //           ) {
    //             // Set the new direction and alignment
    //             contentElement.setAttribute("style", `direction: ${newDirection}; text-align: ${newAlign};`);
    //             contentElement.style.textAlign = newAlign;

    //             //
    //             hasChanged = true;
    //           }
    //         }
    //       });

    //       // Prevent infinite loop
    //       if (hasChanged) {
    //         hasChanged = false;
    //         observer.disconnect();
    //         setTimeout(
    //           () =>
    //             observer.observe(promptTextarea, {
    //               childList: true,
    //               subtree: true,
    //               characterData: true,
    //             }),
    //           0
    //         );
    //       }
    //     }
    //   });
    // });

    // // הפעלת המעקב
    // observer.observe(promptTextarea, {
    //   childList: true,
    //   subtree: true,
    //   characterData: true,
    // });
  } catch (error) {
    console.error(error);
    if (error === "Timeout: Form element not found within 30 seconds") {
      await browser.runtime.sendMessage({
        action: "showToast",
        type: "error",
        body: "An error occurred when trying to apply the text alignment feature, probably because of a update in the ChatGPT interface. We apologize for the inconvenience and are working to resolve the issue.",
      });
    }
  }
}
