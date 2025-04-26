
export default function extractParagraphTexts(container: HTMLElement) {
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