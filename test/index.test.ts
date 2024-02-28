import { expect, test, vi } from "vitest";

import { createClient } from "../src";

test("makes a request", async () => {
  const mock = vi.fn().mockImplementation(fetch);

  const client = createClient({
    baseUrl: "https://example.com",
    apiKey: "123",
    entities: {
      contact: "Contact",
    },
  });

  const res = await client.contact
    .get({
      select: ["name"],
      where: [["id", "=", 1]],
    })
    .one();

  expect(res).toEqual([
    "Contact",
    "get",
    { select: ["name"], where: [["id", "=", 1]] },
    0,
  ]);

  // expect(mock).toHaveBeenCalledTimes(1);
});
