chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "welcomePage/welcome.html",
    });
  }

  if (reason === "update") {
    await chrome.storage.sync.set({ showWhatsNewToast: true });
    chrome.action.setBadgeText({ text: "1" });
    chrome.action.setBadgeBackgroundColor({ color: "#008000" });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    // If the user navigates to a ChatGPT conversation, inject the mathTextAlignment and textAlignmentButton scripts
    if (changeInfo.url) {
      if (tab.url && tab.url.includes("chatgpt.com/c/")) {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: [
            "scripts/mathTextAlignment.js",
            "scripts/textAlignmentButton.js",
          ],
        });
      }

      // If the user navigates to the main ChatGPT page, inject the textAlignmentButton script
      if (
        tab.url &&
        tab.url.includes("chatgpt.com") &&
        !tab.url.includes("chatgpt.com/c/")
      ) {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["scripts/textAlignmentButton.js"],
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "showToast") {
    if (message.type === "error") {
      const badgeText = await chrome.action.getBadgeText({});
      const badgeNumber = parseInt(badgeText);

      if (isNaN(badgeNumber)) {
        chrome.action.setBadgeText({ text: "1" });
      } else {
        chrome.action.setBadgeText({ text: (badgeNumber + 1).toString() });
      }
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
      chrome.storage.sync.set({ showErrorToast: true });
      chrome.storage.sync.set({ errorToastMessage: message.body });
    }

    chrome.action.openPopup();
  }

  if (message.action === "closeToast") {
    if (message.type === "error") {
      chrome.storage.sync.set({ showErrorToast: false });
      const badgeText = await chrome.action.getBadgeText({});
      const badgeNumber = parseInt(badgeText);

      if (badgeNumber === 1) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: (badgeNumber - 1).toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#008000" });
      }
    }

    if (message.type === "whatsNew") {
      chrome.storage.sync.set({ showWhatsNewToast: false });
      const badgeText = await chrome.action.getBadgeText({});
      const badgeNumber = parseInt(badgeText);

      if (badgeNumber === 1) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: (badgeNumber - 1).toString() });
      }
    }
  }
});