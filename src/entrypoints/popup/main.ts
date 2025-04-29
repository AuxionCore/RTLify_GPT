const elements = {
  closePopup: "closePopup",
  errorToast: "errorToast",
  errorToastTitle: "errorToastTitle",
  errorToastMessage: "errorToastMessage",
  closeErrorToastButton: "closeErrorToastButton",
  newReleaseToast: "newReleaseToast",
  newReleaseToastTitle: "newReleaseToastTitle",
  newReleaseToastMessage: "newReleaseToastMessage",
  specialMessageForV2: "specialMessageForV2",
  newReleaseToastLink: "newReleaseToastLink",
  closeNewReleaseToastButton: "closeNewReleaseToastButton",
  authorLink: "authorLink",
  buyMeACoffee: "buyMeACoffee",
  versionLink: "versionLink",
  feedbackLink: "feedbackLink",
  rateUsLink: "rateUsLink",
  rateUsLinkText: "rateUsLinkText",
};

async function popupScript() {
  try {
    const newReleaseTitle = browser.i18n.getMessage("newReleaseTitle");
    const versionNumber = browser.runtime.getManifest().version;
    const extensionWasUpdated = browser.i18n.getMessage("extensionWasUpdated", [
      versionNumber,
      `🎉`,
    ]);
    const version2Text = browser.i18n.getMessage("feature6");
    const whatsNewLinkText = browser.i18n.getMessage("whatsNewLinkText");
    const storageData = await browser.storage.sync.get([
      "showWhatsNewToast",
      "showErrorToast",
    ]);
    const showWhatsNewToast = storageData?.showWhatsNewToast;
    const showErrorToast = storageData?.showErrorToast;

    async function setupPopup() {
      setClosePopupButton();
      setEventListeners();
      setFeedbackLink();
      setVersion();
      setRateUsLinkText();
      if (showErrorToast) await setErrorToast();
      if (showWhatsNewToast) await setWhatsNewToast();
    }

    async function setWhatsNewToast() {
      const newReleaseToast = document.getElementById(
        elements.newReleaseToast
      )!;
      const closeToastButton = document.getElementById(
        elements.closeNewReleaseToastButton
      )!;
      const newReleaseToastTitle = document.getElementById(
        elements.newReleaseToastTitle
      )!;
      const newReleaseToastMessage = document.getElementById(
        elements.newReleaseToastMessage
      )!;
      const newReleaseToastLink = document.getElementById(
        elements.newReleaseToastLink
      )!;
      const specialMessageForV2 = document.getElementById(
        elements.specialMessageForV2
      )!;

      newReleaseToastTitle.textContent = newReleaseTitle;
      newReleaseToastMessage.textContent = extensionWasUpdated;
      specialMessageForV2.textContent = version2Text;
      newReleaseToastLink.textContent = whatsNewLinkText;
      newReleaseToastLink.setAttribute("title", whatsNewLinkText);

      newReleaseToast.classList.add("show");
      newReleaseToastLink.addEventListener(
        "click",
        async () => await openTab("whatsNew.html")
      );

      closeToastButton.addEventListener("click", async () => {
        newReleaseToast.classList.remove("show");
        await browser.runtime.sendMessage({
          action: "closeToast",
          type: "whatsNew",
        });
      });
    }

    async function setErrorToast() {
      const errorToast = document.getElementById(elements.errorToast)!;
      const closeToastButton = document.getElementById(
        elements.closeErrorToastButton
      )!;
      const errorToastTitle = document.getElementById(
        elements.errorToastTitle
      )!;
      const errorToastMessage = document.getElementById(
        elements.errorToastMessage
      )!;
      const storageData = await browser.storage.sync.get("errorToastMessage");
      const errorToastMessageText = storageData.errorToastMessage;

      errorToastTitle.textContent =
        browser.i18n.getMessage("errorToastTitle") || "Error Alert";
      errorToastMessage.textContent = errorToastMessageText;

      errorToast.classList.add("show");
      closeToastButton.addEventListener("click", async () => {
        errorToast.classList.remove("show");
        await browser.runtime.sendMessage({
          action: "closeToast",
          type: "error",
        });
      });
    }

    function setClosePopupButton() {
      const closePopup = document.getElementById(elements.closePopup)!;
      closePopup.setAttribute(
        "title",
        browser.i18n.getMessage("popupCloseButton")
      );
      closePopup.addEventListener("click", () => window.close());
    }

    function setEventListeners() {
      const extensionId = browser.runtime.id;
      const links = [
        { id: elements.authorLink, url: "https://github.com/Yedidya10" },
        {
          id: elements.buyMeACoffee,
          url: "https://ko-fi.com/yedidyadev",
        },
        {
          id: elements.versionLink,
          url: `browser-extension://${extensionId}/whatsNewPage/whatsNew.html`,
        },
        {
          id: elements.feedbackLink,
          url: `https://chromewebstore.google.com/detail/${extensionId}/support`,
        },
        {
          id: elements.rateUsLink,
          url: `https://chromewebstore.google.com/detail/${extensionId}/reviews`,
        },
      ];

      links.forEach((link) => {
        const element = document.getElementById(link.id)!;
        element.addEventListener("click", async () => {
          console.log(`Opening ${link.url}`);
          await openTab(link.url);
        });
      });
    }

    function setFeedbackLink() {
      const feedbackLink = document.getElementById(elements.feedbackLink)!;
      const feedbackText =
        browser.i18n.getMessage("feedbackTitle") || "Feedback";
      const bagReportText =
        browser.i18n.getMessage("bugReportTitle") || "Report a Bug";
      feedbackLink.textContent = `${feedbackText} / ${bagReportText}`;
    }

    function setVersion() {
      const versionElement = document.getElementById(elements.versionLink)!;
      versionElement.textContent = `v${versionNumber}`;
    }

    function setRateUsLinkText() {
      const rateUsLink = document.getElementById(elements.rateUsLink)!;
      const rateUsText = browser.i18n.getMessage("rateUsTitle") || "Rate Us";
      rateUsLink.textContent = `⭐ ${rateUsText}`;
    }

    async function openTab(url: string): Promise<void> {
      await browser.tabs.create({ url });
    }

    await setupPopup();
  } catch (error) {
    console.error("Error in popup script:", error);
  }
}
popupScript();
