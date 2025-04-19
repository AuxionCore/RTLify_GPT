const messageKeys = [
  "welcomeTitle",
  "welcomeHeading",
  "welcomeMessage",
  "GoToChatGpt",
  "GoToClaudeAi",
  "whatsNewTitle",
  "whatsNewMessage",
  "featuresTitle",
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
];
const messages = messageKeys.reduce((acc, key) => {
  acc[key] = chrome.i18n.getMessage(key);
  return acc;
}, {} as Record<string, string>);

export default messages;
