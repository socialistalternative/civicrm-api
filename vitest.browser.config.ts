/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "test/browser/public",
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: "chrome",
    },
    dir: "test/browser",
    setupFiles: ["test/mock/browser.ts"],
  },
});
