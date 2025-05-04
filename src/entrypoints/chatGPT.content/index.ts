import displayAlignmentButton from "./textAlignmentButton";
import mathTextAlignment from "./mathTextAlignment";

const urlPatternStrings = [
  "https://chatgpt.com/*",
  "https://chatgpt.com/?model=auto*",
  "https://chatgpt.com/?temporary-chat=true",
  "https://chatgpt.com/c/*",
];

const urlMatchPatterns = urlPatternStrings.map((p) => new MatchPattern(p));

export default defineContentScript({
  matches: urlPatternStrings,
  excludeMatches: ["https://chatgpt.com/gpts"],
  async main(ctx) {
    mathTextAlignment();
    await displayAlignmentButton();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (urlMatchPatterns.some((pattern) => pattern.includes(newUrl))) {
        await displayAlignmentButton();
      }
    });
  },
});
