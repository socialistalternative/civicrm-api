import { DeferredPromise } from "@open-draft/deferred-promise";
import { noop } from "lodash-es";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createClient } from "../src";
import { server } from "./mock/server";

const config = {
  baseUrl: "https://example.com",
  auth: { apiKey: "mock-api-key" },
  api3: {
    enabled: true,
    entities: {
      contact: {
        name: "Contact",
        actions: {
          getList: "getlist",
          delete: "delete",
        },
      },
      activity: {
        name: "Activity",
        actions: {
          getList: "getlist",
        },
      },
    },
  },
};

const client = createClient(config);

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

test("makes a request", async () => {
  await client.api3.contact.getList();
  const req = await request;

  expect(req.url).toBe(
    "https://example.com/civicrm/ajax/rest?entity=Contact&action=getlist&json=%7B%7D",
  );
});

test("sets entity and action params", async () => {
  await client.api3.contact.delete();
  const req = await request;
  const url = new URL(req.url);

  expect(url.searchParams.get("entity")).toBe("Contact");
  expect(url.searchParams.get("action")).toBe("delete");
});

test("sets request headers", async () => {
  await client.api3.contact.getList();
  const req = await request;

  expect(req.headers.get("X-Civi-Auth")).toBe("Bearer mock-api-key");
  expect(req.headers.get("X-Requested-With")).toBe("XMLHttpRequest");
  expect(req.headers.get("Content-Type")).toBe(
    "application/x-www-form-urlencoded",
  );
});

test("accepts request options", async () => {
  await client.api3.contact.requestOptions({ cache: "no-cache" }).getList();
  const req = await request;

  expect(req.cache).toBe("no-cache");
});

test("accepts additional headers", async () => {
  await client.api3.contact
    .requestOptions({ headers: { "X-Correlation-Id": "mock-correlation-id" } })
    .getList();
  const req = await request;

  expect(req.headers.get("X-Civi-Auth")).toBe("Bearer mock-api-key");
  expect(req.headers.get("X-Correlation-Id")).toBe("mock-correlation-id");
});

test("applies default request options", async () => {
  const clientWithDefaults = createClient({
    ...config,
    requestOptions: {
      cache: "no-cache",
      headers: { "X-Correlation-Id": "mock-correlation-id" },
    },
  });
  await clientWithDefaults.api3.contact.getList();
  const req = await request;

  expect(req.cache).toBe("no-cache");
  expect(req.headers.get("X-Civi-Auth")).toBe("Bearer mock-api-key");
  expect(req.headers.get("X-Correlation-Id")).toBe("mock-correlation-id");
});

test("parses response", () => {
  expect(client.api3.contact.getList()).resolves.toEqual("Mock response");
});

test("accepts params", async () => {
  await client.api3.contact.getList({ input: "mock-input" });
  const req = await request;

  const searchParams = new URL(req.url).searchParams;
  const params = JSON.parse(searchParams.get("json")!);

  expect(params).toEqual({ input: "mock-input" });
});

test("accepts options", async () => {
  await client.api3.contact.getList().option("limit", 10);
  const req = await request;

  const searchParams = new URL(req.url).searchParams;
  const params = JSON.parse(searchParams.get("json")!);

  expect(params).toEqual({ options: { limit: 10 } });
});

test("accepts params and options", async () => {
  await client.api3.contact
    .getList({ input: "mock-input" })
    .option("limit", 10);
  const req = await request;

  const searchParams = new URL(req.url).searchParams;
  const params = JSON.parse(searchParams.get("json")!);

  expect(params).toEqual({ input: "mock-input", options: { limit: 10 } });
});

describe("debug", () => {
  const clientWithDebug = createClient({ ...config, debug: true });

  const consoleSpy = {
    group: vi.spyOn(console, "group").mockImplementation(noop),
    groupEnd: vi.spyOn(console, "groupEnd").mockImplementation(noop),
    error: vi.spyOn(console, "error").mockImplementation(noop),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("logs request timing", async () => {
    await clientWithDebug.api3.contact.getList();
    const req = await request;
    const requestId = req.headers.get("X-Request-Id");

    expect(consoleSpy.group).toHaveBeenCalledWith(
      `CiviCRM request ${requestId} https://example.com/civicrm/ajax/rest?entity=Contact&action=getlist&json=%7B%7D 200 in 0ms`,
    );
    expect(consoleSpy.groupEnd).toHaveBeenCalled();
  });

  test("logs request errors", async () => {
    try {
      await clientWithDebug.api3.activity.getList();
    } catch {}

    expect(consoleSpy.group).toHaveBeenCalled();
    expect(consoleSpy.error).toHaveBeenCalledWith("Internal Server Error");
    expect(consoleSpy.groupEnd).toHaveBeenCalled();
  });
});
