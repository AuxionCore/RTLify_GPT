async function detectLanguage(inputText: string) {
  const result = await chrome.i18n.detectLanguage(inputText);

  if (result && result.languages) {
    const lang = result.languages[0].language;
    return lang;
  } else {
    throw new Error("Language detection failed");
  }
}

function extractParagraphTexts(container: HTMLElement) {
  const paragraphs = container.querySelectorAll<HTMLParagraphElement>(
    "p.whitespace-pre-wrap.break-words"
  );

  const texts: string[] = [];
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (text) {
      texts.push(text);
    }
  });

  return texts;
}

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
