import { applyRTLStyleToGptResponse } from "./resDirStyle";
import extractParagraphTexts from "./extractParagraphTexts";
import detectLanguage from "./detectLanguage";
import addAlignButton from "./resAlignButton";

async function handleGptResponseAlignment(streamingElement: HTMLDivElement) {
  const rtlLanguageCodes = ["iw", "he", "ar", "fa"];

  let allTexts: string[] = [];
  for (const child of streamingElement.children) {
    const texts = extractParagraphTexts(child as HTMLElement);
    allTexts.push(...texts);
  }
  const combinedText = allTexts.join(" ").trim();

  if (combinedText.length > 0) {
    try {
      const lang = await detectLanguage(combinedText);

      if (lang && rtlLanguageCodes.includes(lang)) {
        applyRTLStyleToGptResponse(
          streamingElement.children[0] as HTMLDivElement
        );
      }

      // Display RTL switch button in case the element is not correctly aligned
      const secondChild = streamingElement.children[1] as HTMLElement;
      const grandchild = secondChild.children[0] as HTMLElement;

      addAlignButton(streamingElement, grandchild.children[0] as HTMLElement);
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }
}

export default handleGptResponseAlignment;
