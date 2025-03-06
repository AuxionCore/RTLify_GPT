(async () => {
  try {
    const waitForTextarea = () => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const textarea = document.getElementById("composer-background");
          if (textarea) {
            clearInterval(interval);
            resolve(textarea);
          }
        }, 1000);
      });
    };

    const alignRightText = chrome.i18n.getMessage("alignRight");
    const alignLeftText = chrome.i18n.getMessage("alignLeft");

    // Wait for the textarea to load
    const textarea = await waitForTextarea();
    console.log("textarea", textarea);
    const textareaMenu = textarea
      .querySelector(".justify-between")
      .querySelector(".text-token-text-primary");

    const formatAlignRight = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4">
     <path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/>
     </svg>`;
    const formatAlignLeft = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4">
      <path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/>
      </svg>`;

    const alignIconBtn = document.createElement("div");
    alignIconBtn.innerHTML = formatAlignRight;
    alignIconBtn.id = "align-icon-btn";
    alignIconBtn.style.display = "flex";
    alignIconBtn.style.alignItems = "center";
    alignIconBtn.style.justifyContent = "center";
    alignIconBtn.style.cursor = "pointer";
    alignIconBtn.style.border = "solid 1px #b4b4b450";
    alignIconBtn.style.borderRadius = "50%";
    alignIconBtn.style.backgroundColor = "transparent";
    alignIconBtn.style.paddingInline = "10px";
    alignIconBtn.style.marginRight = "10px";
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
      const promptTextarea = document.getElementById("prompt-textarea");
      if (alignIconBtn.getAttribute("data-state") === "left") {
        alignIconBtn.setAttribute("data-state", "right");
        alignIconBtn.setAttribute("title", alignLeftText);
        alignIconBtn.innerHTML = formatAlignLeft;
        promptTextarea.style.direction = "rtl";
        promptTextarea.style.textAlign = "right";
      } else {
        alignIconBtn.setAttribute("data-state", "left");
        alignIconBtn.setAttribute("title", alignRightText);
        alignIconBtn.innerHTML = formatAlignRight;
        promptTextarea.style.direction = "ltr";
        promptTextarea.style.textAlign = "left";
      }
    });
  } catch (error) {
    console.error("Error in main.js:", error);
  }
})();
