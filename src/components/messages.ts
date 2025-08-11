import { debugWarn, debugError } from '../utils/debugLogger';

const messageKeys = [
  "welcomeTitle",
  "welcomeHeading", 
  "welcomeMessage",
  "GoToChatGpt",
  "GoToClaudeAi",
  "whatsNewTitle",
  "whatsNewMessage",
  "featuresTitle",
  "newFeaturesTitle",
  "improvementsTitle",
  "feature1",
  "feature2",
  "feature3",
  "feature3Comment",
  "feature4",
  "feature5",
  "feature6",
  "improvement1",
  "comingSoonTitle",
  "comingSoonMessage",
  "comingSoonFeature1",
  "feedbackTitle",
  "feedbackMessage",
  "feedbackButtonText",
  // Changelog related messages
  "changelogTitle",
  "changelogMessage",
  "viewFullChangelogButton",
  "hideChangelogButton",
  "currentVersionTitle",
  "addedLabel",
  "fixedLabel",
  "changedLabel",
  "removedLabel",
  "changesInVersion",
  // Version specific translations
  "modernIconDesign",
  "textAlignmentButtonFix",
  "claudeTextAlignmentFix",
  "mathTextDisplayFix",
  "grokSupport",
  "wxtFrameworkUpdate",
  "claudeAlignmentFix",
  "claudeElementAlignment",
  "claudeFullSupport",
  "errorToastFeature",
  "timeoutHandling",
  "popupErrorFix",
  "selectorUpdate",
  "automaticAlignment",
  "deleteAllTextSupport",
  "disableAutoPopup",
  "typingAlignmentFix",
  "userPreferences",
  "whatsNewInPopup",
  "inactiveLinksFixed",
  "textDirectionAlignment",
  "installUpdatePages",
  "viteSupport",
  "dynamicVersionDisplay",
  "typescriptSupport",
  "separatedContentPages",
  "multipleButtonsFix",
  "feedbackLinkUpdate",
  "urduTranslationRemoval",
  "textAlignmentButton",
  "mathTextLTR",
  "arabicTranslation",
  "persianTranslation",
  "hebrewTranslation"
];

const messages = messageKeys.reduce((acc, key) => {
  const message = browser.i18n.getMessage(key as any);
  if (!message) {
    debugWarn(`Missing translation for key: ${key}`);
    acc[key] = `[${key}]`; // Fallback to show the key name
  } else {
    acc[key] = message;
  }
  return acc;
}, {} as Record<string, string>);

// Validation function to check for missing translations
export function validateTranslations(): string[] {
  const missingKeys: string[] = [];
  
  messageKeys.forEach(key => {
    const message = browser.i18n.getMessage(key as any);
    if (!message || message === key) {
      missingKeys.push(key);
    }
  });
  
  if (missingKeys.length > 0) {
    debugError("Missing translations detected:", missingKeys);
    // In development, throw an error to fail the build
    if (import.meta.env.DEV) {
      throw new Error(`Missing translations: ${missingKeys.join(', ')}`);
    }
  }
  
  return missingKeys;
}

export default messages;
