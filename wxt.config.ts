import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    permissions: ["storage"],
    host_permissions: ["https://chatgpt.com/", "https://claude.ai/"],
  },
  zip: {
    excludeSources: ["playwright-report/**", "e2e/**", "test-results/**"],
  },
});
