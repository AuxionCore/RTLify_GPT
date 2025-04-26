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
    function getFormElements(timeout = 15000): Promise<{
      formElement: HTMLFormElement;
      promptTextarea: HTMLTextAreaElement;
    }> {
      return new Promise<{
        formElement: HTMLFormElement;
        promptTextarea: HTMLTextAreaElement;
      }>((resolve, reject) => {
        const startTime = Date.now();

        const interval = setInterval(() => {
          const formElement = document.querySelector(
            "form[data-type='unified-composer']"
          ) as HTMLFormElement;

          if (formElement) {
            const promptTextarea = formElement.querySelector(
              "#prompt-textarea"
            ) as HTMLTextAreaElement;

            clearInterval(interval);
            resolve({ formElement, promptTextarea });
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
    const mainFormElements = await getFormElements();
    const mainFormElement = mainFormElements.formElement;
    const promptTextarea = mainFormElements.promptTextarea;

    promptTextarea.style.direction = alignState === "left" ? "ltr" : "rtl";
    promptTextarea.style.textAlign = alignState === "left" ? "left" : "right";

    const textareaMenu = mainFormElement.querySelector(
      ".bg-primary-surface-primary > div > .flex, .bg-primary-surface-primary > div > .items-center, .bg-primary-surface-primary > div > .gap-2, .bg-primary-surface-primary > div > .max-xs\\:gap-1"
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

      let formatAlignText =
        alignState === "left" ? alignRightText : alignLeftText;
      let formatAlignPathEl =
        alignState === "left" ? formatAlignRightPathEl : formatAlignLeftPathEl;

      alignElement.innerHTML = `
        <span class="" data-state="closed">
          <div
            class="inline-flex h-9 rounded-full border text-[13px] font-medium radix-state-open:bg-black/10 text-token-text-secondary border-token-border-light focus-visible:outline-black can-hover:hover:bg-token-main-surface-secondary dark:focus-visible:outline-white dark:can-hover:hover:bg-gray-700">
            <button
              id="alignButton"
              aria-label="${formatAlignText}" 
              title="${formatAlignText}" 
              class="flex items-center justify-center h-9 rounded-full border border-token-border-light text-token-text-secondary w-9 can-hover:hover:bg-token-main-surface-secondary dark:can-hover:hover:bg-gray-700"
            >
              <svg 
                width="24" 
                height="24"
                viewBox="0 -960 960 960" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-label="" 
                class="h-[18px] w-[18px]"
              >
                ${formatAlignPathEl}
              </svg>
            </button>
          </div>
        </span>
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
