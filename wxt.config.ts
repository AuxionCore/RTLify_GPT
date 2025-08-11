import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  zip: {
    excludeSources: ["playwright-report/**", "e2e/**", "test-results/**"],
  },
  webExt: {
    disabled: true,
  },
  debug: true,
  manifest: ({ browser, manifestVersion, mode, command }) => {
    const isFirefox = browser === "firefox";

    const baseManifest: {
      name: string;
      description: string;
      default_locale: string;
      permissions: string[];
      browser_specific_settings?: {
        gecko: {
          id: string;
        };
      };
      key?: string;
    } = {
      name: "__MSG_extensionName__",
      description: "__MSG_extensionDescription__",
      default_locale: "en",
      permissions: ["storage"],
    };

    if (isFirefox) {
      baseManifest.browser_specific_settings = {
        gecko: {
          id: "{a1514ede-80dd-4f0a-a850-de51aa7623cf}",
        },
      };
    }

    return baseManifest;
  },
});
