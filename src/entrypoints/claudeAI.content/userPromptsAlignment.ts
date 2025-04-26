import extractParagraphTexts from "./extractParagraphTexts";
import detectLanguage from "./detectLanguage";

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
    const texts = extractParagraphTexts(child as HTMLElement);
    allTexts.push(...texts);
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const lang = await detectLanguage(combinedText);

      if (lang && rtlLanguageCodes.includes(lang)) {
        await applyRTLStyleToUserPrompts(element);
      }
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}
