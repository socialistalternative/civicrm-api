/// <reference types="vitest" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/mock-server.ts"],
    fakeTimers: {
      toFake: [...configDefaults.fakeTimers.toFake, "performance"],
    },
  },
});
