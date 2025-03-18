const elements = {
  closePopup: "closePopup",
  authorLink: "authorLink",
  buyMeACoffee: "buyMeACoffee",
  version: "version",
  feedbackLink: "feedbackLink",
};

function setupPopup() {
  setClosePopupButton();
  setEventListeners();
  setVersion();
}

function setClosePopupButton() {
  const closePopup = document.getElementById(elements.closePopup)!;
  closePopup.setAttribute("title", chrome.i18n.getMessage("popupCloseButton"));
  closePopup.addEventListener("click", () => window.close());
}

function setEventListeners() {
  const links = [
    { id: elements.authorLink, url: "https://github.com/Yedidya10" },
    { id: elements.buyMeACoffee, url: "https://www.buymeacoffee.com/yedidya" },
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
  const versionNumber = chrome.runtime.getManifest().version;
  versionElement.textContent = `v${versionNumber}`;
}

function openTab(url: string): void {
  chrome.tabs.create({ url });
}

document.addEventListener("DOMContentLoaded", setupPopup);
