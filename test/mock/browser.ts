import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { afterAll, afterEach, beforeAll } from "vitest";

export const worker = setupWorker(...handlers);

beforeAll(async () => {
  await worker.start();
});

afterAll(() => worker.stop());

afterEach(() => worker.resetHandlers());
