/**
 * Toast management utilities for popup
 */

import { safeExecute } from '../utils/errorHandler';

interface ToastElements {
  toast: HTMLElement;
  closeButton: HTMLElement;
  title: HTMLElement;
  message: HTMLElement;
}

export class ToastManager {
  private static async showToast(elements: ToastElements, onClose?: () => Promise<void>): Promise<void> {
    elements.toast.classList.add("show");
    
    if (onClose) {
      elements.closeButton.addEventListener("click", async () => {
        elements.toast.classList.remove("show");
        await safeExecute(onClose, 'toast close handler');
      });
    }
  }

  static async showWhatsNewToast(
    newReleaseTitle: string,
    extensionWasUpdated: string,
    version2Text: string,
    whatsNewLinkText: string
  ): Promise<void> {
    const elements = {
      toast: document.getElementById("newReleaseToast")!,
      closeButton: document.getElementById("closeNewReleaseToastButton")!,
      title: document.getElementById("newReleaseToastTitle")!,
      message: document.getElementById("newReleaseToastMessage")!,
      link: document.getElementById("newReleaseToastLink")!,
      specialMessage: document.getElementById("specialMessageForV2")!,
    };

    // Set content
    elements.title.textContent = newReleaseTitle;
    elements.message.textContent = extensionWasUpdated;
    elements.specialMessage.textContent = version2Text;
    elements.link.textContent = whatsNewLinkText;
    elements.link.setAttribute("title", whatsNewLinkText);

    // Set up link click handler
    elements.link.addEventListener("click", async () => {
      await safeExecute(async () => {
        await browser.tabs.create({ url: "whatsNewPage.html" });
      }, 'whats new link click');
    });

    await this.showToast(elements, async () => {
      await browser.runtime.sendMessage({
        action: "closeToast",
        type: "whatsNew",
      });
    });
  }

  static async showErrorToast(errorMessage: string): Promise<void> {
    const elements = {
      toast: document.getElementById("errorToast")!,
      closeButton: document.getElementById("closeErrorToastButton")!,
      title: document.getElementById("errorToastTitle")!,
      message: document.getElementById("errorToastMessage")!,
    };

    elements.title.textContent = browser.i18n.getMessage("errorToastTitle") || "Error Alert";
    elements.message.textContent = errorMessage;

    await this.showToast(elements, async () => {
      await browser.runtime.sendMessage({
        action: "closeToast",
        type: "error",
      });
    });
  }
}
