import { DeferredPromise } from "@open-draft/deferred-promise";
import { afterEach, beforeEach, expect, test } from "vitest";

import { createClient } from "../../src";
import { worker } from "../mock/browser";

const client = createClient({
  baseUrl: "https://example.com",
  auth: { username: "user", password: "pass" },
  entities: {
    contact: "Contact",
  },
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

let request: DeferredPromise<Request>;

beforeEach(() => {
  request = new DeferredPromise();

  worker.events.on("request:start", (req) => {
    request.resolve(req.request);
  });
});

afterEach(() => {
  worker.events.removeAllListeners();
});

test("api4 client", async () => {
  expect(client.contact.get({ where: [["id", "=", 1]] })).resolves.toEqual(
    "Mock response",
  );

  const req = await request;
  const url = new URL(req.url);

  expect(req.headers.get("X-Civi-Auth")).toBe("Basic " + btoa("user:pass"));
  expect(url.pathname).toBe("/civicrm/ajax/api4/Contact/get");
  expect(url.searchParams.get("params")).toBe(
    JSON.stringify({ where: [["id", "=", 1]] }),
  );
});

test("api3 client", async () => {
  expect(client.api3.contact.getList({ input: "mock-input" })).resolves.toEqual(
    "Mock response",
  );

  const req = await request;
  const url = new URL(req.url);

  expect(req.headers.get("X-Civi-Auth")).toBe("Basic " + btoa("user:pass"));
  expect(url.pathname).toBe("/civicrm/ajax/rest");
  expect(url.searchParams.get("entity")).toBe("Contact");
  expect(url.searchParams.get("action")).toBe("getlist");
  expect(url.searchParams.get("json")).toBe(
    JSON.stringify({ input: "mock-input" }),
  );
});
