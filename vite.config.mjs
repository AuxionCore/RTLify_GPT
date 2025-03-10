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
        serviceWorker: "serviceWorker.ts",
        "scripts/main": "scripts/main.ts",
        "scripts/contentA": "scripts/contentA.ts",
        "scripts/contentB": "scripts/contentB.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
}));
