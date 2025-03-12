chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (changeInfo.url) {
      if (tab.url && tab.url.includes("chatgpt.com")) {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["scripts/contentA.js", "scripts/contentB.js"],
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});
