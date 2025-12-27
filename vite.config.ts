import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import {libInjectCss} from "vite-plugin-lib-inject-css";  // ← Add this
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
    dts({
      insertTypesEntry: true,
    }),
    libInjectCss(),  // ← Add this plugin
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RouteKeeper",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    cssCodeSplit: false, // Keeps all CSS in one style.css file
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
        },
        assetFileNames: "style.css", // Ensures consistent CSS filename
      },
    },
  },
});