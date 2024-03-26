import { DeferredPromise } from "@open-draft/deferred-promise";
import { afterEach, beforeEach, expect, test } from "vitest";

import { createClient } from "../src";
import { server } from "./mock-server";

const clientConfig = {
  baseUrl: "https://example.com",
  apiKey: "mock-api-key",
};

const client = createClient({
  ...clientConfig,
  entities: {
    contact: "Contact",
    activity: "Activity",
  },
});

let request: DeferredPromise<Request>;

beforeEach(() => {
  request = new DeferredPromise();

  server.events.on("request:start", (req) => {
    request.resolve(req.request);
  });
});

afterEach(() => {
  server.events.removeAllListeners();
});

test("requires baseUrl", () => {
  expect(() => {
    // @ts-ignore
    createClient({ apiKey: "mock-api-key" });
  }).toThrow("baseUrl is required");
});

test("requires apiKey", () => {
  expect(() => {
    // @ts-ignore
    createClient({ baseUrl: "https://example.com" });
  }).toThrow("apiKey is required");
});

test("creates methods for specified entities", () => {
  expect(client.contact).toBeDefined();
  expect(client.activity).toBeDefined();
});

test("does not create api3 methods if not enabled", () => {
  expect(client.api3).toBeUndefined();
});

test("creates api3 methods if enabled", () => {
  const api3Client = createClient({
    ...clientConfig,
    api3: {
      enabled: true,
      entities: {
        contact: {
          name: "Contact",
          actions: {
            getList: "getlist",
          },
        },
      },
    },
  });

  expect(api3Client.api3.contact).toBeDefined();
});
