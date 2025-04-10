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
        "scripts/chatgpt/mathTextAlignment":
          "src-ts/scripts/chatgpt/mathTextAlignment.ts",
        "scripts/chatgpt/textAlignmentButton":
          "src-ts/scripts/chatgpt/textAlignmentButton.ts",
        "scripts/claude/mathTextAlignment":
          "src-ts/scripts/claude/mathTextAlignment.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
}));
