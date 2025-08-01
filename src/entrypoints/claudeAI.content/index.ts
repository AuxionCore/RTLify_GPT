import { ContentScriptContext } from "#imports";
import { URL_PATTERNS, EXCLUDED_PATTERNS } from "../../constants";
import handleLoadedElements from "../claudeAI.content/loadedElements";
import observeDocument from "../claudeAI.content/docObserver";
import displayAlignmentButton from "./textAlignmentButton";

const existsChatPattern = new MatchPattern("https://claude.ai/chat/*");
const newChatPattern = new MatchPattern("https://claude.ai/new");

export default defineContentScript({
  matches: URL_PATTERNS.CLAUDE,
  excludeMatches: EXCLUDED_PATTERNS.CLAUDE,
  async main(ctx) {
    observeDocument();
    await displayAlignmentButton();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (existsChatPattern.includes(newUrl)) {
        handleLoadedElements();
        await displayAlignmentButton();
      }

      if (newChatPattern.includes(newUrl)) {
        await displayAlignmentButton();
      }
    });
  },
});
