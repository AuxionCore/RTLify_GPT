"use strict";
(async () => {
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
    const formatAlignRightIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M144-744v-72h672v72H144Zm192 150v-72h480v72H336ZM144-444v-72h672v72H144Zm192 150v-72h480v72H336ZM144-144v-72h672v72H144Z"/></svg>`;
    const formatAlignLeftIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4"><path d="M144-144v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Zm0-150v-72h480v72H144Zm0-150v-72h672v72H144Z"/></svg>`;
    const alignRightText = chrome.i18n.getMessage("alignRight");
    const alignLeftText = chrome.i18n.getMessage("alignLeft");
    try {
        function getComposerBackgroundElement() {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    const composerBackgroundElement = document.getElementById("composer-background");
                    if (composerBackgroundElement) {
                        clearInterval(interval);
                        resolve(composerBackgroundElement);
                    }
                }, 500);
            });
        }
        async function getAlignState() {
            try {
                const result = await chrome.storage.sync.get("alignState");
                if (result.alignState) {
                    return result.alignState;
                }
                else {
                    await chrome.storage.sync.set({ alignState: "left" });
                    return "left";
                }
            }
            catch (error) {
                console.error(error);
                return "left";
            }
        }
        const alignState = await getAlignState();
        const composerBackgroundElement = await getComposerBackgroundElement();
        const promptTextarea = composerBackgroundElement.querySelector("#prompt-textarea");
        promptTextarea.style.direction = alignState === "left" ? "ltr" : "rtl";
        promptTextarea.style.textAlign = alignState === "left" ? "left" : "right";
        const textareaMenu = composerBackgroundElement.querySelector(".justify-between .text-token-text-primary");
        if (textareaMenu) {
            const alignIconBtn = textareaMenu.querySelector("#align-icon-btn");
            if (!alignIconBtn) {
                addAlignButton(textareaMenu);
            }
        }
        function addAlignButton(textareaMenu) {
            const alignIconBtn = document.createElement("div");
            alignIconBtn.id = "align-icon-btn";
            alignIconBtn.innerHTML =
                alignState === "left" ? formatAlignRightIcon : formatAlignLeftIcon;
            Object.assign(alignIconBtn.style, buttonStyles);
            alignIconBtn.setAttribute("title", alignState === "left" ? alignRightText : alignLeftText);
            textareaMenu.prepend(alignIconBtn);
            alignIconBtn.addEventListener("mouseover", () => {
                alignIconBtn.style.backgroundColor = "#424242";
            });
            alignIconBtn.addEventListener("mouseout", () => {
                alignIconBtn.style.backgroundColor = "transparent";
            });
            alignIconBtn.addEventListener("click", async () => {
                const newState = alignState === "left" ? "right" : "left";
                const newTitle = newState === "left" ? alignRightText : alignLeftText;
                const newSvg = newState === "left" ? formatAlignRightIcon : formatAlignLeftIcon;
                alignIconBtn.setAttribute("title", newTitle);
                alignIconBtn.innerHTML = newSvg;
                promptTextarea.style.direction = newState;
                promptTextarea.style.textAlign = newState;
                try {
                    await chrome.storage.sync.set({ alignState: newState });
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
    }
    catch (error) {
        console.error("Error in main.js:", error);
    }
})();
