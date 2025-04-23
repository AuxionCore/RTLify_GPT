import handleLoadedElements from "./scripts/claude/loadedElements";
import observeDocument from "./scripts/claude/documentObserver";

chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "welcomePage/welcome.html",
    });
  }

  if (reason === "update") {
    await chrome.storage.sync.set({ showWhatsNewToast: true });

    // TODO: fix this
    // chrome.action.setBadgeText({ text: "1" });
    // chrome.action.setBadgeBackgroundColor({ color: "#008000" });
  }

  if (reason === "update" && previousVersion === "1.2.1") {
    await chrome.action.openPopup();
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  try {
    console.log("Tab created: ", tab);
  } catch (error) {
    console.error(error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    // If the user navigates to a ChatGPT conversation, inject the mathTextAlignment and textAlignmentButton scripts
    if (changeInfo.url && tab.url) {
      if (tab.url.includes("chatgpt.com")) {
        if (tab.url.includes("chatgpt.com/c/")) {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [
              "scripts/chatgpt/mathTextAlignment.js",
              "scripts/chatgpt/textAlignmentButton.js",
            ],
          });
        }

        // If the user navigates to the main ChatGPT page, inject the textAlignmentButton script
        if (!tab.url.includes("chatgpt.com/c/")) {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/chatgpt/textAlignmentButton.js"],
          });
        }
      }

      // If the user navigates to the Claude page, inject the rtlTextAlignment script
      if (tab.url.includes("claude.ai")) {
        console.log("Claude AI: ", tab.url, changeInfo);
        if (tab.url.includes("claude.ai/chat")) {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/claude/textAlignmentButton.js"],
            func: handleLoadedElements,
          });
        }

        if (tab.url.includes("claude.ai/new")) {
          // await chrome.scripting.executeScript({
          //   target: { tabId: tabId },
          //   func: observeDocument,
          // });

          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/claude/textAlignmentButton.js"],
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "runScript" && sender.tab && sender.tab.id) {
    if (message.script === "documentObserver") {
      await chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: observeDocument,
      });
    }

    if (message.script === "loadedElements") {
      await chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: handleLoadedElements,
      });
    }
  }

  if (message.action === "showToast") {
    if (message.type === "error") {
      // TODO: fix this
      //   const badgeText = await chrome.action.getBadgeText({});
      //   const badgeNumber = parseInt(badgeText);

      //   if (isNaN(badgeNumber)) {
      //     chrome.action.setBadgeText({ text: "1" });
      //   } else {
      //     chrome.action.setBadgeText({ text: (badgeNumber + 1).toString() });
      //   }
      //   chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });

      chrome.storage.sync.set({ showErrorToast: true });
      chrome.storage.sync.set({ errorToastMessage: message.body });
    }

    await chrome.action.openPopup();
  }

  if (message.action === "closeToast") {
    if (message.type === "error") {
      chrome.storage.sync.set({ showErrorToast: false });

      // TODO: fix this
      // const badgeText = await chrome.action.getBadgeText({});
      // const badgeNumber = parseInt(badgeText);

      // if (badgeNumber === 1) {
      //   chrome.action.setBadgeText({ text: "" });
      // } else {
      //   chrome.action.setBadgeText({ text: (badgeNumber - 1).toString() });
      //   chrome.action.setBadgeBackgroundColor({ color: "#008000" });
      // }
    }

    if (message.type === "whatsNew") {
      chrome.storage.sync.set({ showWhatsNewToast: false });

      // TODO: fix this
      // const badgeText = await chrome.action.getBadgeText({});
      // const badgeNumber = parseInt(badgeText);

      // if (badgeNumber === 1) {
      //   chrome.action.setBadgeText({ text: "" });
      // } else {
      //   chrome.action.setBadgeText({ text: (badgeNumber - 1).toString() });
      // }
    }
  }
});
