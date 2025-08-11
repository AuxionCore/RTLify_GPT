import "./style.css";
import messages, { validateTranslations } from "@/components/messages";
import getUILanguageDirection from "@/components/getUILanguageDirection";
import { changelog, formatDate } from "@/data/changelog";
import { debugLog, debugError } from '@/utils/debugLogger';

// Validate translations on page load
try {
  validateTranslations();
  debugLog("All translations validated successfully");
} catch (error) {
  debugError("Translation validation failed:", error);
}

// Get message texts
const whatsNewTitle = messages["whatsNewTitle"];
const whatsNewMessage = messages["whatsNewMessage"];
const currentVersionTitle = messages["currentVersionTitle"];
const changelogTitle = messages["changelogTitle"];
const changelogMessage = messages["changelogMessage"];
const viewFullChangelogButton = messages["viewFullChangelogButton"];
const addedLabel = messages["addedLabel"];
const fixedLabel = messages["fixedLabel"];
const changedLabel = messages["changedLabel"];
const removedLabel = messages["removedLabel"];
const feedbackTitle = messages["feedbackTitle"];
const feedbackMessage = messages["feedbackMessage"];
const feedbackButtonText = messages["feedbackButtonText"];

// Current version content from translation files
const modernIconDesign = messages["modernIconDesign"];
const textAlignmentButtonFix = messages["textAlignmentButtonFix"];
const claudeTextAlignmentFix = messages["claudeTextAlignmentFix"];
const mathTextDisplayFix = messages["mathTextDisplayFix"];
const version300Features = messages["version300Features"];
const version300Fixes = messages["version300Fixes"];

// Translated changelog entries  
const grokSupport = messages["grokSupport"];
const wxtFrameworkUpdate = messages["wxtFrameworkUpdate"];
const claudeAlignmentFix = messages["claudeAlignmentFix"];
const claudeFullSupport = messages["claudeFullSupport"];
const errorToastFeature = messages["errorToastFeature"];
const timeoutHandling = messages["timeoutHandling"];
const selectorUpdates = messages["selectorUpdates"];
const automaticAlignment = messages["automaticAlignment"];
const deleteAllTextSupport = messages["deleteAllTextSupport"];
const disableAutoPopup = messages["disableAutoPopup"];
const typingAlignmentFix = messages["typingAlignmentFix"];
const userPreferences = messages["userPreferences"];
const whatsNewInPopup = messages["whatsNewInPopup"];
const inactiveLinksFixed = messages["inactiveLinksFixed"];
const textDirectionAlignment = messages["textDirectionAlignment"];
const installUpdatePages = messages["installUpdatePages"];
const viteSupport = messages["viteSupport"];
const dynamicVersionDisplay = messages["dynamicVersionDisplay"];
const typescriptSupport = messages["typescriptSupport"];
const separatedContentPages = messages["separatedContentPages"];
const multipleButtonsFix = messages["multipleButtonsFix"];
const feedbackLinkUpdate = messages["feedbackLinkUpdate"];
const urduTranslationRemoval = messages["urduTranslationRemoval"];
const textAlignmentButton = messages["textAlignmentButton"];
const mathTextLTR = messages["mathTextLTR"];
const arabicTranslation = messages["arabicTranslation"];
const persianTranslation = messages["persianTranslation"];
const hebrewTranslation = messages["hebrewTranslation"];

// Set HTML attributes
const html = document.querySelector("html");
if (html) {
  const lang = browser.i18n.getUILanguage();
  html.setAttribute("lang", lang);
  html.setAttribute("dir", getUILanguageDirection(lang));
}

// Get current version changes
const currentVersion = browser.runtime.getManifest().version;
const currentChanges = changelog.find(entry => entry.version === currentVersion);

function getTranslatedChangelogItems(entry: any): any {
  const translationMap: { [key: string]: any } = {
    "3.0.0-beta.1": {
      added: [grokSupport],
      changed: [wxtFrameworkUpdate],
      fixed: [claudeAlignmentFix]
    },
    "2.0.1": {
      fixed: [claudeAlignmentFix]
    },
    "2.0.0": {
      added: [claudeFullSupport, errorToastFeature],
      fixed: [timeoutHandling, "תיקון פתיחת חלון קופץ לאחר הגדרת הודעת שגיאה ב-service worker"]
    },
    "1.2.1": {
      fixed: [selectorUpdates]
    },
    "1.2.0": {
      added: [automaticAlignment, deleteAllTextSupport],
      changed: [disableAutoPopup],
      fixed: [typingAlignmentFix]
    },
    "1.1.1": {
      added: [userPreferences],
      changed: [whatsNewInPopup],
      fixed: [inactiveLinksFixed]
    },
    "1.1.0": {
      added: [textDirectionAlignment, userPreferences, installUpdatePages, viteSupport],
      changed: [dynamicVersionDisplay, typescriptSupport]
    },
    "1.0.1": {
      changed: [separatedContentPages],
      fixed: [multipleButtonsFix, feedbackLinkUpdate],
      removed: [urduTranslationRemoval]
    },
    "1.0.0": {
      added: [textAlignmentButton, mathTextLTR, arabicTranslation, persianTranslation, hebrewTranslation]
    }
  };

  const result = translationMap[entry.version] || {};
  
  // Debug: log what we're getting
  debugLog(`Version ${entry.version}:`, result);
  
  // Filter out undefined values for each category
  Object.keys(result).forEach(key => {
    if (Array.isArray(result[key])) {
      result[key] = result[key].filter(item => item && item.trim() !== '' && item !== 'undefined');
      debugLog(`${key} items for ${entry.version}:`, result[key]);
    }
  });
  
  return result;
}

function createChangelogSection(entry: any, isCurrentVersion = false): string {
  const sectionClass = isCurrentVersion ? 'current-version-section' : 'version-section';
  const titleClass = isCurrentVersion ? 'current-version-title' : 'version-title';
  
  let content = `
    <section class="${sectionClass}">
      <h2 class="${titleClass}">
        ${isCurrentVersion ? currentVersionTitle : `גירסה ${entry.version}`}
        <span class="version-date">${formatDate(entry.date, browser.i18n.getUILanguage())}</span>
      </h2>
  `;

  // For current version, use translated content
  if (isCurrentVersion && entry.version === "3.0.0") {
    content += `
      <div class="changes-group">
        <h3 class="change-type added">${addedLabel}</h3>
        <ul class="changes-list">
          <li>${modernIconDesign}</li>
        </ul>
      </div>
      <div class="changes-group">
        <h3 class="change-type fixed">${fixedLabel}</h3>
        <ul class="changes-list">
          <li>${textAlignmentButtonFix}</li>
          <li>${claudeTextAlignmentFix}</li>
          <li>${mathTextDisplayFix}</li>
        </ul>
      </div>
    `;
  } else {
    // For other versions, use translated data
    const translatedEntry = getTranslatedChangelogItems(entry);
    
    if (translatedEntry.added && translatedEntry.added.length > 0) {
      const validItems = translatedEntry.added.filter((item: string) => item && item.trim() !== '' && item !== 'undefined');
      if (validItems.length > 0) {
        content += `
          <div class="changes-group">
            <h3 class="change-type added">${addedLabel}</h3>
            <ul class="changes-list">
              ${validItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    if (translatedEntry.changed && translatedEntry.changed.length > 0) {
      const validItems = translatedEntry.changed.filter((item: string) => item && item.trim() !== '' && item !== 'undefined');
      if (validItems.length > 0) {
        content += `
          <div class="changes-group">
            <h3 class="change-type changed">${changedLabel}</h3>
            <ul class="changes-list">
              ${validItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    if (translatedEntry.fixed && translatedEntry.fixed.length > 0) {
      const validItems = translatedEntry.fixed.filter((item: string) => item && item.trim() !== '' && item !== 'undefined');
      if (validItems.length > 0) {
        content += `
          <div class="changes-group">
            <h3 class="change-type fixed">${fixedLabel}</h3>
            <ul class="changes-list">
              ${validItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    if (translatedEntry.removed && translatedEntry.removed.length > 0) {
      const validItems = translatedEntry.removed.filter((item: string) => item && item.trim() !== '' && item !== 'undefined');
      if (validItems.length > 0) {
        content += `
          <div class="changes-group">
            <h3 class="change-type removed">${removedLabel}</h3>
            <ul class="changes-list">
              ${validItems.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }
  }

  content += `</section>`;
  return content;
}

const mainElement = document.querySelector("main");
if (mainElement) {
  let pageContent = `
    <section class="heading-section">
      <h1>${whatsNewTitle}</h1>
      <p>${whatsNewMessage}</p>
    </section>
  `;

  // Show current version changes
  if (currentChanges) {
    pageContent += createChangelogSection(currentChanges, true);
  }

  // Changelog section with toggle
  pageContent += `
    <section class="changelog-section">
      <h2>${changelogTitle}</h2>
      <p>${changelogMessage}</p>
      <button id="toggleChangelog" class="toggle-button">${viewFullChangelogButton}</button>
      <div id="changelogContent" class="changelog-content hidden">
  `;

  // Add all other versions (excluding current version)
  changelog
    .filter(entry => entry.version !== currentVersion)
    .forEach(entry => {
      pageContent += createChangelogSection(entry);
    });

  pageContent += `
      </div>
    </section>
    
    <section class="feedback">
      <h2>${feedbackTitle}</h2>
      <p>${feedbackMessage}</p>
    </section>
  `;

  mainElement.innerHTML = pageContent;
}

// Add toggle functionality for changelog
const toggleButton = document.getElementById("toggleChangelog");
const changelogContent = document.getElementById("changelogContent");

if (toggleButton && changelogContent) {
  toggleButton.addEventListener("click", () => {
    const isHidden = changelogContent.classList.contains("hidden");
    
    if (isHidden) {
      changelogContent.classList.remove("hidden");
      toggleButton.textContent = messages["hideChangelogButton"] || "Hide Release History";
    } else {
      changelogContent.classList.add("hidden");
      toggleButton.textContent = viewFullChangelogButton;
    }
  });
}

// Add feedback button for Chrome
if (import.meta.env.CHROME) {
  const feedbackButton = document.createElement("button");
  feedbackButton.textContent = feedbackButtonText;
  feedbackButton.className = "feedback-button";

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
