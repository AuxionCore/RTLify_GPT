import displayAlignmentButton from "./textAlignmentButton";
import mathTextAlignment from "./mathTextAlignment";
import { URL_PATTERNS, EXCLUDED_PATTERNS } from "../../constants";

const urlPatternStrings = URL_PATTERNS.GROK;
const urlMatchPatterns = urlPatternStrings.map((p) => new MatchPattern(p));

export default defineContentScript({
  matches: urlPatternStrings,
  excludeMatches: EXCLUDED_PATTERNS.GROK,
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
