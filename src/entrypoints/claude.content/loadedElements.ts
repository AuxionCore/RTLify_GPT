import handleGptResponseAlignment from "./gptResAlignment";
import handleUserPromptsAlignment from "./userPromptsAlignment";

export default async function handleLoadedElements() {
  const elements = document.querySelectorAll<HTMLElement>(
    "[data-test-render-count]"
  );

  if (elements.length === 0) {
    return;
  }

  for (const el of elements) {
    const dataIsNotStreaming = el.querySelector(
      "[data-is-streaming='false']"
    ) as HTMLDivElement;

    if (dataIsNotStreaming) {
      await handleGptResponseAlignment(dataIsNotStreaming as HTMLDivElement);
    } else {
      await handleUserPromptsAlignment(el as HTMLDivElement);
    }
  }
}
