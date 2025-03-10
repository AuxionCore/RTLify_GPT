chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (tab.url && tab.url.includes("chatgpt.com")) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["scripts/contentA.js", "scripts/contentB.js"],
      });
    }
  }
});
