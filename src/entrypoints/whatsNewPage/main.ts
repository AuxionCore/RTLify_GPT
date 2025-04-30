import "./style.css";
import messages from "@/components/messages";
import getUILanguageDirection from "@/components/getUILanguageDirection";

const whatsNewTitle = messages["whatsNewTitle"];
const whatsNewMessage = messages["whatsNewMessage"];
const newFeaturesTitle = messages["newFeaturesTitle"];
const improvementsTitle = messages["improvementsTitle"];
const improvement1 = messages["improvement1"];
const comingSoonTitle = messages["comingSoonTitle"];
const comingSoonFeature1 = messages["comingSoonFeature1"];
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
      <h1 >${whatsNewTitle}</h1>
      <p >${whatsNewMessage}</p>
    </section>
    <section class="features-improvements-section">
      <!-- <div class="features">
        <h2>${newFeaturesTitle}</h2>
        <ul class="features-list">
          <li></li>
        </ul>
      </div> -->
      <div class="improvements">
        <h2 >${improvementsTitle}</h2>
        <ul class="improvements-list">
          <li >${improvement1}</li>
        </ul>
      </div>
    </section>
    <!-- <section class="coming-soon-section">
      <h2 >${comingSoonTitle}</h2>
      <ul class="coming-soon-list">
        <li >${comingSoonFeature1}</li>
      </ul>
    </section> -->
    <section class="feedback">
      <h2 >${feedbackTitle}</h2>
      <p >${feedbackMessage}</p>
    </section>
  `;
}

if (import.meta.env.CHROME) {
  const feedbackButton = document.createElement("button");
  feedbackButton.textContent = feedbackButtonText;

  feedbackButton.addEventListener("click", async () => {
    await openTab(
      "https://chromewebstore.google.com/detail/clhjaenclpjlpjickcmhebbhghjffhah/support"
    );
  });

  const feedbackSection = document.querySelector(".feedback");
  if (feedbackSection) {
    feedbackSection.appendChild(feedbackButton);
  }
}

async function openTab(url: string): Promise<void> {
  await browser.tabs.create({ url });
}
