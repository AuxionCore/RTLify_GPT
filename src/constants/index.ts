/**
 * Constants and configurations for RTLify GPT extension
 */

// Supported RTL languages
export const RTL_LANGUAGES = [
  "ar", // Arabic
  "he", // Hebrew
  "iw", // Hebrew (alternative code)
  "fa", // Persian/Farsi
  "ur", // Urdu
  "yi", // Yiddish
  "jrb", // Judeo-Arabic
  "jpr", // Judeo-Persian
  "dv", // Divehi
  "ps", // Pashto
  "sd", // Sindhi
  "ug", // Uyghur
];

// URL patterns for content scripts
export const URL_PATTERNS = {
  CHATGPT: [
    "https://chatgpt.com/*",
    "https://chatgpt.com/?model=auto*",
    "https://chatgpt.com/?temporary-chat=true",
    "https://chatgpt.com/c/*",
  ],
  CLAUDE: [
    "https://claude.ai/*",
  ],
  GROK: [
    "https://grok.com/",
    "https://grok.com/chat/*",
    "https://grok.com/workspace/*",
  ],
};

// Excluded URL patterns
export const EXCLUDED_PATTERNS = {
  CHATGPT: ["https://chatgpt.com/gpts"],
  CLAUDE: [
    "https://claude.ai/recents",
    "https://claude.ai/upgrade", 
    "https://claude.ai/settings*",
  ],
  GROK: ["https://grok.com/?_s=*"],
};

// DOM selectors
export const SELECTORS = {
  STREAMING_ELEMENT: "[data-is-streaming]",
  RENDER_COUNT_ELEMENT: "[data-test-render-count]",
  ALIGNMENT_BUTTON: ".rtlify-alignment-button",
} as const;

// Timing configurations
export const TIMING = {
  STREAMING_TIMEOUT: 5000, // 5 seconds
  MUTATION_DEBOUNCE: 100,  // 100ms
  PAGE_LOAD_DELAY: 1000,   // 1 second
} as const;

// Extension URLs
export const EXTENSION_URLS = {
  CHROME_STORE: "https://chromewebstore.google.com/detail",
  FIREFOX_ADDONS: "https://addons.mozilla.org/en-US/firefox/addon/rtlify-gpt",
  SUPPORT: {
    GITHUB: "https://github.com/Yedidya10",
    COFFEE: "https://ko-fi.com/yedidyadev",
  },
} as const;

// Element IDs for popup
export const POPUP_ELEMENTS = {
  CLOSE_POPUP: "closePopup",
  ERROR_TOAST: "errorToast",
  ERROR_TOAST_TITLE: "errorToastTitle", 
  ERROR_TOAST_MESSAGE: "errorToastMessage",
  CLOSE_ERROR_TOAST_BUTTON: "closeErrorToastButton",
  NEW_RELEASE_TOAST: "newReleaseToast",
  NEW_RELEASE_TOAST_TITLE: "newReleaseToastTitle",
  NEW_RELEASE_TOAST_MESSAGE: "newReleaseToastMessage",
  SPECIAL_MESSAGE_FOR_V2: "specialMessageForV2",
  NEW_RELEASE_TOAST_LINK: "newReleaseToastLink",
  CLOSE_NEW_RELEASE_TOAST_BUTTON: "closeNewReleaseToastButton",
  AUTHOR_LINK: "authorLink",
  BUY_ME_A_COFFEE: "buyMeACoffee",
  VERSION_LINK: "versionLink",
  FEEDBACK_LINK: "feedbackLink",
  RATE_US_LINK: "rateUsLink",
} as const;
