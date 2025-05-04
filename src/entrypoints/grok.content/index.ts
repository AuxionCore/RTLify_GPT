import displayAlignmentButton from "./textAlignmentButton";
import mathTextAlignment from "./mathTextAlignment";

const urlPatternStrings = [
  "https://grok.com/",
  "https://grok.com/chat/*",
  "https://grok.com/workspace/*",
];

const urlMatchPatterns = urlPatternStrings.map((p) => new MatchPattern(p));

export default defineContentScript({
  matches: urlPatternStrings,
  excludeMatches: ["https://grok.com/?_s=*"],
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
