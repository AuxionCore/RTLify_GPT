import displayAlignmentButton from "./textAlignmentButtonRefactored";
import mathTextAlignment from "./mathTextAlignment";
import { URL_PATTERNS, EXCLUDED_PATTERNS } from "../../constants";

const urlPatternStrings = URL_PATTERNS.CHATGPT;
const urlMatchPatterns = urlPatternStrings.map((p) => new MatchPattern(p));

export default defineContentScript({
  matches: urlPatternStrings,
  excludeMatches: EXCLUDED_PATTERNS.CHATGPT,
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
