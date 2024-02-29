import { forIn } from "lodash-es";
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

  const client = {} as Client<E>;

  forIn(config.entities, (entity: string, key: string) => {
    Reflect.defineProperty(client, key, {
      get: () =>
        new RequestBuilder(entity, (requestParams, requestOptions) =>
          request.bind(config)(requestParams, {
            ...config.requestOptions,
            ...requestOptions,
          }),
        ),
    });
  });

  return client;
}
