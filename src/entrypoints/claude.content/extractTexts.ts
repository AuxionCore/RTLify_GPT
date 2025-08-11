export type TextBlock = {
  el: HTMLElement;
  hasChildren: boolean;
  tag: string;
  text: string;
};

export function extractGptResponsesText(
  textElements: HTMLElement
): TextBlock[] {
  const blocks: TextBlock[] = [];

  for (const element of textElements.children) {
    const text = element.textContent?.trim() || "";
    if (text) {
      blocks.push({
        el: element as HTMLElement,
        hasChildren: element.children.length > 0,
        tag: element.tagName.toLowerCase(),
        text,
      });
    }
  }

  return blocks;
}

export function extractUserPromptsText(textElements: HTMLElement): TextBlock[] {
  const blocks: TextBlock[] = [];

  for (const element of textElements.children) {
    const text = element.textContent?.trim() || "";
    if (text) {
      blocks.push({
        el: element as HTMLElement,
        hasChildren: element.children.length > 0,
        tag: element.tagName.toLowerCase(),
        text,
      });
    }
  }

  return blocks;
}
