import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  zip: {
    excludeSources: ["playwright-report/**", "e2e/**", "test-results/**"],
  },
  manifest: ({ browser, manifestVersion, mode, command }) => {
    const isFirefox = browser === "firefox";
    const isChrome = browser === "chrome";

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

    if (isChrome) {
      baseManifest.key =
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3GCjHWatESli3UZCpgpU02UzXSOqwB72MjF5gCxkmfQ5Vg6vWQlXPEUcdm+wLYqZuTVEMhuuX2ZtN3NKFG8sdOiCGp8i/6P4Og1woAkuuEH9fVYmYurcPFziErse0xp1FdEKDhti6JlKUiN8oOyY1C6wrXndN08xgHZpfYKmUquhPpLx5nNGfdoEJK+rPcnlRttyia7yxw/ANAg5MXL8lfZDE8f+wMPLwNB7lHu2yJnSbfdEckwl4q0qYuyc1it3KF9iG01gku56RKV4v67ijeevYqEb0XpVSS8KBzKjKtkydiD3Q1BWUhLKRh/nxA/+VFvIVqQ6t8kK/5KIH1HWSwIDAQAB";
    }

    return baseManifest;
  },
});
