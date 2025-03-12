(async () => {
  try {
    const waitForTextarea = () => {
      return new Promise<HTMLElement>((resolve) => {
        const interval = setInterval(() => {
          const textarea = document.getElementById("composer-background");
          if (textarea) {
            clearInterval(interval);
            resolve(textarea as HTMLElement);
          }
        }, 1000);
      });
    };

    interface TextareaMenu extends HTMLElement {
      appendChild<T extends Node>(newChild: T): T;
    }

    interface AlignIconBtn extends HTMLDivElement {
      setAttribute(qualifiedName: string, value: string): void;
      getAttribute(qualifiedName: string): string | null;
      innerHTML: string;
      style: CSSStyleDeclaration;
    }

    const buttonStyles = {
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "solid 1px #b4b4b450",
      borderRadius: "50%",
      backgroundColor: "transparent",
    };

    const formatAlignRightIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M144-744v-72h672v72H144Zm192 150v-72h480v72H336ZM144-444v-72h672v72H144Zm192 150v-72h480v72H336ZM144-144v-72h672v72H144Z"/></svg>`;
    const formatAlignLeftIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M144-144v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Z"/></svg>`;

    const addAlignButton = (textareaMenu: TextareaMenu) => {
      if (document.getElementById("align-icon-btn")) return;

      const alignRightText: string = chrome.i18n.getMessage("alignRight");
      const alignLeftText: string = chrome.i18n.getMessage("alignLeft");

      const alignIconBtn: AlignIconBtn = document.createElement(
        "div"
      ) as AlignIconBtn;
      alignIconBtn.id = "align-icon-btn";
      alignIconBtn.innerHTML = formatAlignRightIcon;
      Object.assign(alignIconBtn.style, buttonStyles);
      alignIconBtn.setAttribute("data-state", "left");
      alignIconBtn.setAttribute("title", alignRightText);

      textareaMenu.appendChild(alignIconBtn);

      alignIconBtn.addEventListener("mouseover", () => {
        alignIconBtn.style.backgroundColor = "#424242";
      });

      alignIconBtn.addEventListener("mouseout", () => {
        alignIconBtn.style.backgroundColor = "transparent";
      });

      alignIconBtn.addEventListener("click", () => {
        const promptTextarea: HTMLTextAreaElement = document.getElementById(
          "prompt-textarea"
        ) as HTMLTextAreaElement;
        const newState =
          alignIconBtn.getAttribute("data-state") === "left" ? "right" : "left";
        const newTitle = newState === "left" ? alignRightText : alignLeftText;
        const newSvg =
          newState === "left" ? formatAlignRightIcon : formatAlignLeftIcon;

        alignIconBtn.setAttribute("data-state", newState);
        alignIconBtn.setAttribute("title", newTitle);
        alignIconBtn.innerHTML = newSvg;

        promptTextarea.style.direction = newState === "left" ? "ltr" : "rtl";
        promptTextarea.style.textAlign = newState === "left" ? "left" : "right";
      });
    };

    const textarea = await waitForTextarea();
    const textareaMenu = textarea.querySelector(
      ".justify-between .text-token-text-primary"
    );

    if (textareaMenu) {
      const alignIconBtn = document.getElementById("align-icon-btn");

      if (alignIconBtn) {
        addAlignButton(textareaMenu as TextareaMenu);
      }
    }

    const observer = new MutationObserver(() => {
      const updatedMenu = textarea.querySelector(
        ".justify-between .text-token-text-primary"
      );
      if (updatedMenu) {
        addAlignButton(updatedMenu as TextareaMenu);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error("Error in main.js:", error);
  }
})();
