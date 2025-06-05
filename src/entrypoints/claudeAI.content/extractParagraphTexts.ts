export type TextBlock = {
  el: HTMLElement;
  tag: string;
  text: string;
};

export default function extractParagraphTexts(
  container: HTMLElement
): TextBlock[] {
  const blocks: TextBlock[] = [];

  const paragraphs = container.querySelectorAll<HTMLParagraphElement>("p, li, ul, ol, h1, h2, h3, h4, h5, h6");

  paragraphs.forEach((p) => {
    const lines = p.innerHTML.split(/<br\s*\/?>/i);

    lines.forEach((lineHtml) => {
      const temp = document.createElement("div");
      temp.innerHTML = lineHtml;
      const text = temp.textContent?.trim();

      if (text && text.length > 0) {
        blocks.push({
          el: p,
          tag: "p",
          text,
        });
      }
    });
  });

  return blocks;
}
