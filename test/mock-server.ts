import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const restHandlers = [
  http.post(/https:\/\/example.com\/civicrm\/ajax\/api4\/Contact\/(.+)/, () => {
    return HttpResponse.json({
      values: "Mock response",
    });
  }),
  http.post(
    /https:\/\/example.com\/civicrm\/ajax\/api4\/Activity\/(.+)/,
    () => {
      return HttpResponse.text("Internal Server Error", { status: 500 });
    },
  ),
];

export const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterAll(() => server.close());

afterEach(() => server.resetHandlers());
