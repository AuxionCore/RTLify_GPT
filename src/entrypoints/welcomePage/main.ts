import "./style.css";
import messages from "@/components/messages";
import getUILanguageDirection from "@/components/getUILanguageDirection";

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

const html = document.querySelector("html");
if (html) {
  const lang = browser.i18n.getUILanguage();
  html.setAttribute("lang", lang);
  html.setAttribute("dir", getUILanguageDirection(lang));
}

const mainElement = document.querySelector("main");

if (mainElement) {
  mainElement.innerHTML = `
    <section class="heading-section">
      <h1 >${welcomeTitle}</h1>
      <p >${welcomeMessage}</p>
      <div class="buttons">
      </div>
    </section>
    <section class="features-section">
      <h2 >${featuresTitle}</h2>
      <ul class="features">
        <li >${feature1}</li>
        <li >${feature2}</li>
        <li >${feature4}</li>
        <li >${feature5}</li>
        <li >${feature3}</li>
        <p class="feature3Comment">${feature3Comment}</p>
      </ul>
    </section>
    <section class="feedback">
      <h2>${feedbackTitle}</h2>
      <p>${feedbackMessage}</p>
    </section>
  `;
}

const goToChatGptButton = document.createElement("button");
goToChatGptButton.textContent = GoToChatGptText;
const goToClaudeAiButton = document.createElement("button");
goToClaudeAiButton.textContent = GoToClaudeAiText;
const feedbackButton = document.createElement("button");
feedbackButton.textContent = feedbackButtonText;

goToChatGptButton.addEventListener("click", async () => {
  await openTab("https://chatgpt.com/");
});

goToClaudeAiButton.addEventListener("click", async () => {
  await openTab("https://claude.ai/");
});

feedbackButton.addEventListener("click", async () => {
  await openTab(
    "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support"
  );
});

const buttonsContainer = document.querySelector(".buttons");
if (buttonsContainer) {
  buttonsContainer.appendChild(goToChatGptButton);
  buttonsContainer.appendChild(goToClaudeAiButton);
}

const feedbackSection = document.querySelector(".feedback");
if (feedbackSection) {
  feedbackSection.appendChild(feedbackButton);
}

async function openTab(url: string): Promise<void> {
  await browser.tabs.create({ url });
}
