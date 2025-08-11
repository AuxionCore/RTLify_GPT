import { URL_PATTERNS, EXCLUDED_PATTERNS } from "../../constants";
import observeDocument from "./docObserver";
const existsChatPattern = new MatchPattern("https://claude.ai/chat/*");
const newChatPattern = new MatchPattern("https://claude.ai/new");

import displayAlignmentButton from "./textAlignmentButton";

export default defineContentScript({
  matches: URL_PATTERNS.CLAUDE,
  excludeMatches: EXCLUDED_PATTERNS.CLAUDE,
  async main(ctx) {
    observeDocument();
    await displayAlignmentButton();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (existsChatPattern.includes(newUrl)) {
        // await handleLoadedElements();
        await displayAlignmentButton();
        // observeDocument();
      }

      if (newChatPattern.includes(newUrl)) {
        await displayAlignmentButton();
      }
    });
  },
});
