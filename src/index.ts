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

  return mapValues(config.entities, (entity) => (requestInit) => {
    return new RequestBuilder(entity, (requestParams) =>
      request.bind(config)(requestParams, requestInit),
    );
  });
}
