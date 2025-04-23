import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => ({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "./" },
        { src: "_locales", dest: "./" },
        { src: "images", dest: "./" },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        welcome: "welcomePage/welcome.html",
        whatsNew: "whatsNewPage/whatsNew.html",
        popup: "popup/popup.html",
        serviceWorker: "src-ts/serviceWorker.ts",
        "js_src/scripts/chatgpt/mathTextAlignment":
          "src-ts/scripts/chatgpt/mathTextAlignment.ts",
        "js_src/scripts/chatgpt/textAlignmentButton":
          "src-ts/scripts/chatgpt/textAlignmentButton.ts",
        "js_src/scripts/claude/claudeChat": "src-ts/scripts/claude/claudeChat.ts",
        "js_src/scripts/claude/textAlignment":
          "src-ts/scripts/claude/textAlignment.ts",
        "js_src/scripts/claude/textAlignmentButton":
          "src-ts/scripts/claude/textAlignmentButton.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
}));
