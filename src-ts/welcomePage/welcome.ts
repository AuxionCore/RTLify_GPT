import messages from "../messages";

const welcomeTitle = messages["welcomeTitle"];
const welcomeMessage = messages["welcomeMessage"];
const GoToChatGptText = messages["GoToChatGpt"];
const GoToClaudeAiText = messages["GoToClaudeAi"];
const featuresTitle = messages["featuresTitle"];
const feature1 = messages["feature1"];
const feature2 = messages["feature2"];
const feature3 = messages["feature3"];
const feature3Comment = messages["feature3Comment"];
const feature4 = messages["feature4"];
const feature5 = messages["feature5"];
const feature6 = messages["feature6"];
const feedbackTitle = messages["feedbackTitle"];
const feedbackMessage = messages["feedbackMessage"];
const feedbackButtonText = messages["feedbackButtonText"];

document.getElementById("title")!.textContent = welcomeTitle;
document.getElementById("heading")!.textContent = welcomeTitle;
document.getElementById("welcomeMessage")!.textContent = welcomeMessage;
document.getElementById("featuresTitle")!.textContent = featuresTitle;
document.getElementById("feature1")!.textContent = feature1;
document.getElementById("feature2")!.textContent = feature2;
document.getElementById("feature3")!.textContent = feature3;
document.getElementById("feature3Comment")!.textContent = feature3Comment;
document.getElementById("feature4")!.textContent = feature4;
document.getElementById("feature5")!.textContent = feature5;
document.getElementById("feature6")!.textContent = feature6;
document.getElementById("feedbackTitle")!.textContent = feedbackTitle;
document.getElementById("feedbackMessage")!.textContent = feedbackMessage;

const goToChatGptButton = document.getElementById("goToChatGptButton")!;
const goToClaudeAiButton = document.getElementById("goToClaudeAiButton")!;
goToChatGptButton.textContent = GoToChatGptText;
goToClaudeAiButton.textContent = GoToClaudeAiText;

goToChatGptButton.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://chatgpt.com/" });
});

goToClaudeAiButton.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://claude.ai/" });
});


const feedbackButton = document.getElementById("feedbackButton")!;
feedbackButton.textContent = feedbackButtonText;

feedbackButton.addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support",
  });
});
