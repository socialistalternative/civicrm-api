import { Client, ClientConfig } from "./types";
import { Api4 } from "./api4/types";
import { Api3 } from "./api3/types";
import { createApi4Client } from "./api4/client";
import { createApi3Client } from "./api3/client";

export function createClient<
  E extends Api4.EntitiesConfig,
  F extends Api3.EntitiesConfig,
>(config: ClientConfig<E, F>): Client<E, F> {
  if (!config.baseUrl) {
    throw new Error("baseUrl is required");
  }

  if (!config.apiKey) {
    throw new Error("apiKey is required");
  }

  const client = createApi4Client(config) as Client<E, F>;

  if (config.api3?.enabled) {
    client.api3 = createApi3Client(config);
  }

  return client;
}
