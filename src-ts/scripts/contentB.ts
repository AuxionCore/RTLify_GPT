(async () => {
  try {
    // פונקציה לחכות להופעת ה-textarea
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

    // ממשק לתיאור של תפריט ה-Textarea
    interface TextareaMenu extends HTMLElement {
      appendChild<T extends Node>(newChild: T): T;
    }

    // אייקון כפתור alignment
    interface AlignIconBtn extends HTMLDivElement {
      setAttribute(qualifiedName: string, value: string): void;
      getAttribute(qualifiedName: string): string | null;
      innerHTML: string;
      style: CSSStyleDeclaration;
    }

    // משתנים עבור הסגנון של הכפתור
    const buttonStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "solid 1px #b4b4b450",
      borderRadius: "50%",
      backgroundColor: "transparent",
      paddingInline: "10px",
      marginRight: "10px",
    };

    const svgAlignRight = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4">
      <path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/>
    </svg>`;

    const svgAlignLeft = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="http://www.w3.org/2000/svg" width="20px" fill="#b4b4b4">
      <path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/>
    </svg>`;

    // פונקציה להוספת כפתור alignment
    const addAlignButton = (textareaMenu: TextareaMenu) => {
      if (document.getElementById("align-icon-btn")) return;

      const alignRightText: string = chrome.i18n.getMessage("alignRight");
      const alignLeftText: string = chrome.i18n.getMessage("alignLeft");

      const alignIconBtn: AlignIconBtn = document.createElement(
        "div"
      ) as AlignIconBtn;
      alignIconBtn.id = "align-icon-btn";
      alignIconBtn.innerHTML = svgAlignRight;
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
        const newSvg = newState === "left" ? svgAlignRight : svgAlignLeft;

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
      addAlignButton(textareaMenu as TextareaMenu);
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
