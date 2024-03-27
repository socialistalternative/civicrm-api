/// <reference types="vitest" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
    },
    dir: "test",
    exclude: ["**/browser/**"],
    setupFiles: ["test/mock/server.ts"],
    fakeTimers: {
      toFake: [...configDefaults.fakeTimers.toFake, "performance"],
    },
  },
});
