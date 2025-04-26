import handleGptResponseAlignment from "./gptResAlignment";
import handleUserPromptsAlignment from "./userPromptsAlignment";

export default function handleLoadedElements() {
  const elements = document.querySelectorAll<HTMLElement>(
    "[data-test-render-count]"
  );

  if (elements.length === 0) {
    console.log("[claude] No elements found. Exiting.");
    return;
  }

  elements.forEach((el) => {
    const dataIsNotStreaming = el.querySelector(
      "[data-is-streaming='false']"
    ) as HTMLDivElement;

    if (dataIsNotStreaming) {
      handleGptResponseAlignment(dataIsNotStreaming as HTMLDivElement);
    } else {
      handleUserPromptsAlignment(el as HTMLDivElement);
    }
  });

  console.log("[observer] Started observing DOM mutations.");
}
