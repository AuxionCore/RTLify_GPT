import { Page } from "@playwright/test";

export async function openPopup(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  await page.waitForSelector("footer");

  const popup = {
    // Get the GitHub Author link
    getAuthorLink: async () => {
      return page.locator("footer #authorLink");
    },

    // Get the buyMeACoffee link
    getBuyMeACoffeeLink: async () => {
      return page.locator("footer #buyMeACoffee");
    },

    // Get the feedbackLink
    getFeedbackLink: async () => {
      return page.locator("footer #feedbackLink");
    },

    // Get the version link
    getVersionLink: async () => {
      return page.locator("footer #versionLink");
    },

    // Get the rateUs link
    getRateUsLink: async () => {
      return page.locator("footer #rateUsLink");
    },

    // Get the closePopup button
    getClosePopupButton: async () => {
      return page.locator("footer #closePopup");
    },
  };
  return popup;
}
