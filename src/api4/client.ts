import { forIn } from "lodash-es";

import { request } from "./request";
import { Api4 } from "./types";
import { RequestBuilder } from "./request-builder";
import { ClientConfig } from "../types";

export function createApi4Client<E extends Api4.EntitiesConfig>(
  config: ClientConfig<E, any>,
) {
  const client = {} as Api4.Client<E>;

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
