import { test, expect } from "./fixtures";
import { openPopup } from "./pages/popup";

test("Popup links open when clicked", async ({ page, extensionId }) => {
  const popup = await openPopup(page, extensionId);

  // Check if the GitHub Author link is present and clickable
  const authorLink = await popup.getAuthorLink();
  await expect(authorLink).toBeVisible();
  await authorLink.click();
  await page.waitForTimeout(1000); // Wait for the link to open
  const pages = page.context().pages();
  const authorPage = pages[pages.length - 1]; // Check if the author page is opened in the last opened page
  expect(authorPage.url()).toContain("github.com/Yedidya10"); // Check if the URL contains the GitHub link
  authorPage.close(); // Close the author page


  // Check if the buyMeACoffee link is present and clickable
  const buyMeACoffeeLink = await popup.getBuyMeACoffeeLink();
  await expect(buyMeACoffeeLink).toBeVisible();
  await buyMeACoffeeLink.click();
  await page.waitForTimeout(1000); // Wait for the link to open
  const buyMeACoffeePage = page.context().pages()[0];
  expect(buyMeACoffeePage.url()).toContain("ko-fi.com/yedidyadev"); // Check if the URL contains the buyMeACoffee link
  await buyMeACoffeePage.close(); // Close the buyMeACoffee page
return
  await page.bringToFront(); // Bring the popup back to the front

  // Check if the feedback link is present and clickable
  const feedbackLink = await popup.getFeedbackLink();
  await expect(feedbackLink).toBeVisible();
  await feedbackLink.click();
  await page.waitForTimeout(1000); // Wait for the link to open
  const feedbackPage = page.context().pages()[0];
  expect(feedbackPage.url()).toContain("support"); // Check if the URL contains the feedback link
  await feedbackPage.close(); // Close the feedback page

  await page.bringToFront(); // Bring the popup back to the front

  // Check if the version link is present and clickable
  const versionLink = await popup.getVersionLink();
  await expect(versionLink).toBeVisible();
  await versionLink.click();
  await page.waitForTimeout(1000); // Wait for the link to open
  const versionPage = page.context().pages()[0];
  expect(versionPage.url()).toContain("whatsNewPage/whatsNew.html"); // Check if the URL contains the version link
  await versionPage.close(); // Close the version page

  await page.bringToFront(); // Bring the popup back to the front

  // Check if the rateUs link is present and clickable
  // const rateUsLink = await popup.getRateUsLink();
  // await expect(rateUsLink).toBeVisible();
  // await rateUsLink.click();
  // await page.waitForTimeout(1000); // Wait for the link to open
  // const rateUsPage = page.context().pages()[0];
  // expect(rateUsPage.url()).toContain("chromewebstore.google.com/detail"); // Check if the URL contains the rateUs link
  // await rateUsPage.close(); // Close the rateUs page

  // await page.bringToFront(); // Bring the popup back to the front

  // Check if the closePopup button is present and clickable
  const closePopupButton = await popup.getClosePopupButton();
  await expect(closePopupButton).toBeVisible();
  await closePopupButton.click(); // Click the close button
  await page.waitForTimeout(1000); // Wait for the popup to close
  const popupClosed = await page.isVisible("#popup"); // Check if the popup is closed
  expect(popupClosed).toBe(false); // The popup should be closed


});
