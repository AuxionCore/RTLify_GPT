import { ContentScriptContext } from "#imports";
const existsChatPattern = new MatchPattern("https://claude.ai/chat/*");
const newChatPattern = new MatchPattern("https://claude.ai/new");
import handleLoadedElements from "../claudeAI.content/loadedElements";
import observeDocument from "../claudeAI.content/docObserver";
import displayAlignmentButton from "./textAlignmentButton";

export default defineContentScript({
  matches: ["https://claude.ai/*"],
  excludeMatches: [
    "https://claude.ai/recents",
    "https://claude.ai/upgrade",
    "https://claude.ai/settings*",
  ],
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
