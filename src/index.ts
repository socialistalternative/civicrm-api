import { mapValues } from "lodash-es";

import { request } from "./request";
import { RequestBuilder } from "./request-builder";
import { Client, ClientConfig, EntitiesConfig } from "./types";

export function createClient<E extends EntitiesConfig>(
  config: ClientConfig<E>,
): Client<E> {
  if (!config.baseUrl) {
    throw new Error("baseUrl is required");
  }

  if (!config.apiKey) {
    throw new Error("apiKey is required");
  }

  const req = request.bind(config);

  return mapValues(config.entities, (entity) => {
    return new RequestBuilder(entity, req);
  });
}
