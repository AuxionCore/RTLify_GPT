(async () => {
  try {
    const waitForTextarea = () => {
      return new Promise<HTMLElement>((resolve) => {
        const interval = setInterval(() => {
          const textarea = document.getElementById("composer-background");
          if (textarea) {
            clearInterval(interval);
            resolve(textarea);
          }
        }, 1000);
      });
    };

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

    const createAlignIconBtn = (direction: string): HTMLDivElement => {
      const alignIconBtn: HTMLDivElement = document.createElement("div");
      const alignRightText = chrome.i18n.getMessage("alignRight");
      const alignLeftText = chrome.i18n.getMessage("alignLeft");

      const formatAlignRight: string = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/></svg>`;
      const formatAlignLeft: string = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/></svg>`;

      alignIconBtn.innerHTML =
        direction === "left" ? formatAlignRight : formatAlignLeft;
      alignIconBtn.id = "align-icon-btn";
      Object.assign(alignIconBtn.style, buttonStyles);
      alignIconBtn.setAttribute("data-state", direction);
      alignIconBtn.setAttribute(
        "title",
        direction === "left" ? alignRightText : alignLeftText
      );

      alignIconBtn.addEventListener("mouseover", () => {
        alignIconBtn.style.backgroundColor = "#424242";
      });

      alignIconBtn.addEventListener("mouseout", () => {
        alignIconBtn.style.backgroundColor = "transparent";
      });

      alignIconBtn.addEventListener("click", () => {
        const promptTextarea = document.getElementById(
          "prompt-textarea"
        ) as HTMLTextAreaElement;
        if (promptTextarea) {
          const newDirection =
            alignIconBtn.getAttribute("data-state") === "left"
              ? "right"
              : "left";
          alignIconBtn.setAttribute("data-state", newDirection);
          alignIconBtn.setAttribute(
            "title",
            newDirection === "left" ? alignRightText : alignLeftText
          );
          alignIconBtn.innerHTML =
            newDirection === "left" ? formatAlignRight : formatAlignLeft;
          promptTextarea.style.direction =
            newDirection === "left" ? "ltr" : "rtl";
          promptTextarea.style.textAlign =
            newDirection === "left" ? "left" : "right";
        }
      });

      return alignIconBtn;
    };

    const textarea = (await waitForTextarea()) as HTMLElement;
    const textareaMenu = textarea.querySelector(
      ".justify-between .text-token-text-primary"
    );

    if (textareaMenu) {
      textareaMenu.appendChild(createAlignIconBtn("left"));
    }
  } catch (error) {
    console.error("Error in main.js:", error);
  }
})();
