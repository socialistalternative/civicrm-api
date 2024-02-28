/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    setupFiles: ["./test/mock-server.ts"],
  },
});
