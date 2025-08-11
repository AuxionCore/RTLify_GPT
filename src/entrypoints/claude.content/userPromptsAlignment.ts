import {extractUserPromptsText} from "./extractTexts";
import detectLanguage from "./detectLanguage";
import { debugError } from "../../utils/debugLogger";

async function applyRTLStyleToUserPrompts(el: HTMLDivElement) {
  const userMessages = el.querySelector<HTMLDivElement>(
    "[data-testid=user-message]"
  );
  userMessages?.style.setProperty("direction", "rtl");
}

export default async function handleUserPromptsAlignment(
  element: HTMLDivElement
) {
  const rtlLanguageCodes = ["iw", "he", "ar", "fa"];

  let allTexts: string[] = [];
  for (const child of element.children) {
    const texts = extractUserPromptsText(child as HTMLElement);
    allTexts.push(...texts.map((text) => text.text.trim()));
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const [detected, langObj] = await detectLanguage(combinedText);

      if (detected && langObj && rtlLanguageCodes.includes(langObj.language)) {
        await applyRTLStyleToUserPrompts(element);
      }
    } catch (error) {
      debugError("Error detecting language:", error);
    }
  }
}
