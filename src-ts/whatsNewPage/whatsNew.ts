import messages from "../messages";

const whatsNewTitle = messages["whatsNewTitle"];
const whatsNewMessage = messages["whatsNewMessage"];
const featuresTitle = messages["featuresTitle"];
const feature6 = messages["feature6"];
const improvementsTitle = messages["improvementsTitle"];
const comingSoonTitle = messages["comingSoonTitle"];
const comingSoonFeature1 = messages["comingSoonFeature1"];
const feedbackTitle = messages["feedbackTitle"];
const feedbackMessage = messages["feedbackMessage"];
const feedbackButtonText = messages["feedbackButtonText"];

document.getElementById("title")!.textContent = whatsNewTitle;
document.getElementById("heading")!.textContent = whatsNewTitle;
document.getElementById("whatsNewMessage")!.textContent = whatsNewMessage;
document.getElementById("featuresTitle")!.textContent = featuresTitle;
document.getElementById("feature6")!.textContent = feature6;
// document.getElementById("improvementsTitle")!.textContent = improvementsTitle;
document.getElementById("comingSoonTitle")!.textContent = comingSoonTitle;
document.getElementById("comingSoonFeature1")!.textContent = comingSoonFeature1;
document.getElementById("feedbackTitle")!.textContent = feedbackTitle;
document.getElementById("feedbackMessage")!.textContent = feedbackMessage;

const feedbackButton = document.getElementById("feedbackButton")!;
feedbackButton.textContent = feedbackButtonText;

feedbackButton.addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support",
  });
});
