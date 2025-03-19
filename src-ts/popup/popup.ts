(async function () {
  const elements = {
    closePopup: "closePopup",
    newReleaseToast: "newReleaseToast",
    newReleaseToastTitle: "newReleaseToastTitle",
    newReleaseToastMessage: "newReleaseToastMessage",
    newReleaseToastLink: "newReleaseToastLink",
    authorLink: "authorLink",
    buyMeACoffee: "buyMeACoffee",
    version: "version",
    feedbackLink: "feedbackLink",
  };

  const newReleaseTitle = chrome.i18n.getMessage("newReleaseTitle");
  const versionNumber = chrome.runtime.getManifest().version;
  const extensionWasUpdated = chrome.i18n.getMessage("extensionWasUpdated", [
    versionNumber,
    `🎉`,
  ]);
  const whatsNewLinkText = chrome.i18n.getMessage("whatsNewLinkText");
  const storageData = await chrome.storage.sync.get("showWhatsNewToast");
  const showWhatsNewToast = storageData.showWhatsNewToast;

  async function setupPopup() {
    setClosePopupButton();
    setEventListeners();
    if (showWhatsNewToast) await setWhatsNewToast();
    setVersion();
  }

  async function setWhatsNewToast() {
    const newReleaseToast = document.getElementById(elements.newReleaseToast)!;
    newReleaseToast.classList.add("show");
    const newReleaseToastTitle = document.getElementById(
      elements.newReleaseToastTitle
    )!;
    const newReleaseToastMessage = document.getElementById(
      elements.newReleaseToastMessage
    )!;
    const newReleaseToastLink = document.getElementById(
      elements.newReleaseToastLink
    )!;

    newReleaseToastTitle.textContent = newReleaseTitle;
    newReleaseToastMessage.textContent = extensionWasUpdated;
    newReleaseToastLink.textContent = whatsNewLinkText;
    newReleaseToastLink.setAttribute("title", whatsNewLinkText);
    newReleaseToastLink.addEventListener("click", () =>
      openTab("whatsNewPage/whatsNew.html")
    );

    await chrome.storage.sync.set({ showWhatsNewToast: false });
  }

  function setClosePopupButton() {
    const closePopup = document.getElementById(elements.closePopup)!;
    closePopup.setAttribute(
      "title",
      chrome.i18n.getMessage("popupCloseButton")
    );
    closePopup.addEventListener("click", () => window.close());
  }

  function setEventListeners() {
    const links = [
      { id: elements.authorLink, url: "https://github.com/Yedidya10" },
      {
        id: elements.buyMeACoffee,
        url: "https://www.buymeacoffee.com/yedidya",
      },
      {
        id: elements.feedbackLink,
        url: "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support",
      },
    ];

    links.forEach((link) => {
      const element = document.getElementById(link.id)!;
      element.addEventListener("click", () => openTab(link.url));
    });
  }

  function setVersion() {
    const versionElement = document.getElementById(elements.version)!;
    versionElement.textContent = `v${versionNumber}`;
  }

  function openTab(url: string): void {
    chrome.tabs.create({ url });
  }

  await setupPopup();
})();
