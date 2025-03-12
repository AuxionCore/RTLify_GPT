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
        popup: "popup/popup.html",
        serviceWorker: "src-ts/serviceWorker.ts",
        "scripts/mathTextAlignment": "src-ts/scripts/mathTextAlignment.ts",
        "scripts/textAlignmentButton": "src-ts/scripts/textAlignmentButton.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
}));
