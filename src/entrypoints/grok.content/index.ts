import displayAlignmentButton from "./textAlignmentButton";
import mathTextAlignment from "./mathTextAlignment";

const urlChatPattern = new MatchPattern("https://grok.com/chat/**");
const urlMainPattern = new MatchPattern("https://grok.com/");

export default defineContentScript({
  matches: ["https://grok.com/", "https://grok.com/chat/*"],
  excludeMatches: ["https://grok.com/?_s=*"],
  async main(ctx) {
    mathTextAlignment();
    await displayAlignmentButton();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (urlChatPattern.includes(newUrl) || urlMainPattern.includes(newUrl)) {
        await displayAlignmentButton();
      }
    });
  },
});
