import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const restHandlers = [
  // APIv4
  http.post(/https:\/\/example.com\/civicrm\/ajax\/api4\/Contact\/(.+)/, () => {
    return HttpResponse.json({ values: "Mock response" });
  }),
  http.post(
    /https:\/\/example.com\/civicrm\/ajax\/api4\/Activity\/(.+)/,
    () => {
      return HttpResponse.text("Internal Server Error", { status: 500 });
    },
  ),
  // APIv3
  http.post("https://example.com/civicrm/ajax/rest", ({ request }) => {
    if (new URL(request.url).searchParams.get("entity") === "Activity") {
      return HttpResponse.text("Internal Server Error", { status: 500 });
    }

    return HttpResponse.json({ values: "Mock response" });
  }),
];

export const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
