export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(
    async ({ reason, previousVersion }) => {
      if (reason === "install") {
        browser.tabs.create({
          url: "welcomePage.html",
        });
      }

      if (reason === "update") {
        await browser.storage.sync.set({ showWhatsNewToast: true });

        // TODO: fix this
        // chrome.action.setBadgeText({ text: "1" });
        // chrome.action.setBadgeBackgroundColor({ color: "#008000" });
      }

      if (reason === "update" && previousVersion === "1.2.1") {
        await browser.action.openPopup();
      }
    }
  );

  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
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

          browser.storage.sync.set({ showErrorToast: true });
          browser.storage.sync.set({ errorToastMessage: message.body });
        }

        await browser.action.openPopup();
      }

      if (message.action === "closeToast") {
        if (message.type === "error") {
          browser.storage.sync.set({ showErrorToast: false });

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
          browser.storage.sync.set({ showWhatsNewToast: false });

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
    }
  );
});
