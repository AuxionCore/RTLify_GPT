async function setupPopup() {
  // document.getElementById("popupTitle").textContent =
  //   chrome.i18n.getMessage("extensionName");
  document
    .getElementById("closePopup")
    .setAttribute("title", chrome.i18n.getMessage("popupCloseButton"));

  document
    .getElementById("closePopup")
    .addEventListener("click", () => window.close());
  document
    .getElementById("authorLink")
    .addEventListener("click", () => openTab("https://github.com/Yedidya10"));
  document
    .getElementById("buyMeACoffee")
    .addEventListener("click", () =>
      openTab("https://www.buymeacoffee.com/yedidya")
    );
  document.getElementById("version").textContent = `v${
    chrome.runtime.getManifest().version
  }`;
  document
    .getElementById("feedbackLink")
    .addEventListener("click", () =>
      openTab(
        "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support"
      )
    );
}

function openTab(url) {
  chrome.tabs.create({ url });
}

document.addEventListener("DOMContentLoaded", setupPopup);
