import { http, HttpResponse } from "msw";

export const handlers = [
  // API v4
  http.all(/https:\/\/example.com\/civicrm\/ajax\/api4\/Contact\/(.+)/, () => {
    return HttpResponse.json({ values: "Mock response" });
  }),
  http.all(/https:\/\/example.com\/civicrm\/ajax\/api4\/Activity\/(.+)/, () => {
    return HttpResponse.text("Internal Server Error", { status: 500 });
  }),

  // API v3
  http.all("https://example.com/civicrm/ajax/rest", ({ request }) => {
    if (new URL(request.url).searchParams.get("entity") === "Activity") {
      return HttpResponse.text("Internal Server Error", { status: 500 });
    }
  }),
  http.all("https://example.com/civicrm/ajax/rest", () => {
    return HttpResponse.json({ values: "Mock response" });
  }),
];
