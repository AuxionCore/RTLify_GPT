import displayAlignmentButton from "./textAlignmentButton";
import mathTextAlignment from "./mathTextAlignment";

const urlChatPattern = new MatchPattern("https://chatgpt.com/c/*");

export default defineContentScript({
  matches: [
    "https://chatgpt.com/",
    "https://chatgpt.com/?model=auto*",
    "https://chatgpt.com/?temporary-chat=true",
    "https://chatgpt.com/c/*",
  ],
  excludeMatches: ["https://chatgpt.com/gpts"],
  async main(ctx) {
    mathTextAlignment();
    await displayAlignmentButton();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (urlChatPattern.includes(newUrl)) {
        await displayAlignmentButton();
      }
    });
  },
});
