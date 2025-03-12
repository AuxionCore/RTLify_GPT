(async () => {
  type TextareaMenu = HTMLElement;

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

  const alignRightText: string = chrome.i18n.getMessage("alignRight");
  const alignLeftText: string = chrome.i18n.getMessage("alignLeft");

  try {
    const waitForTextarea = () => {
      return new Promise<HTMLElement>((resolve) => {
        const interval = setInterval(() => {
          const textarea = document.getElementById("composer-background");
          if (textarea) {
            clearInterval(interval);
            resolve(textarea);
          }
        }, 500);
      });
    };

    const addAlignButton = (textareaMenu: TextareaMenu) => {
      const alignIconBtn: HTMLDivElement = document.createElement(
        "div"
      ) as HTMLDivElement;
      alignIconBtn.id = "align-icon-btn";
      alignIconBtn.innerHTML = formatAlignRightIcon;
      Object.assign(alignIconBtn.style, buttonStyles);
      alignIconBtn.setAttribute("data-state", "left");
      alignIconBtn.setAttribute("title", alignRightText);

      textareaMenu.prepend(alignIconBtn);

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

    const textarea = (await waitForTextarea()) as HTMLElement;
    const textareaMenu = textarea.querySelector(
      ".justify-between .text-token-text-primary"
    );

    if (textareaMenu) {
      const alignIconBtn = textareaMenu.querySelector("#align-icon-btn");

      if (!alignIconBtn) {
        addAlignButton(textareaMenu as TextareaMenu);
      }
    }
  } catch (error) {
    console.error("Error in main.js:", error);
  }
})();
