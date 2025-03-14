const messageKeys = [
  "welcomeTitle",
  "welcomeHeading",
  "welcomeMessage",
  "GoToChatGpt",
  "whatsNewTitle",
  "featuresTitle",
  "improvementsTitle",
  "feature1",
  "feature2",
  "feature3",
  "feature3Comment",
  "improvement1",
  "improvement2",
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