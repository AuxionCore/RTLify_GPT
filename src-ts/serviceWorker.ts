chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "welcomePage/welcome.html",
    });
  }

  if (reason === "update") {
    await chrome.storage.sync.set({ showWhatsNewToast: true });
    await chrome.action.openPopup();
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    // If the user navigates to a ChatGPT conversation, inject contentA.js and contentB.js
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

      // If the user navigates to the main ChatGPT page, inject contentB.js
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
