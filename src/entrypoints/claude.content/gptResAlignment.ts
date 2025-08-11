/**
 * handleGptResponseAlignment.ts
 * Align only elements that really contain RTL text and leave pure LTR (e.g. math) blocks untouched.
 */

import { applyRTLStyleToGptResponse } from "./resDirStyle";
import { extractGptResponsesText, TextBlock } from "./extractTexts";
import detectRTLLanguage from "./detectLanguage";
import addAlignButton from "./resAlignButton";

export default async function handleGptResponseAlignment(
  streamingElement: HTMLDivElement
) {
  const textElements: TextBlock[] = extractGptResponsesText(
    streamingElement.querySelector(
      ".grid.grid-cols-1.gap-2\\.5"
    ) as HTMLDivElement
  );

  for (const textElement of textElements) {
    try {
      const text = textElement.text.trim();
      if (!text) continue;

      const [isRTL, detectedLanguage] = await detectRTLLanguage(text);

      if (isRTL) {
        console.log("textElement.hasChildren", textElement.hasChildren);
        applyRTLStyleToGptResponse(textElement.el as HTMLDivElement);
      } else {
      }
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  }

  // Optional UX: keep the manual toggle so users can override alignment
  try {
    const secondChild = streamingElement.children[1] as HTMLElement;
    const grandchild = secondChild?.children[0] as HTMLElement | undefined;
    if (grandchild) {
      addAlignButton(streamingElement, grandchild.children[0] as HTMLElement);
    }
  } catch {}
}
