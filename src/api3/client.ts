import { forIn } from "lodash-es";

import { request } from "./request";
import { Api3 } from "./types";
import { RequestBuilder } from "./request-builder";
import { ClientConfig } from "../types";

export function createApi3Client<E extends Api3.EntitiesConfig>(
  config: ClientConfig<any, E>,
) {
  const client = {} as Api3.Client<E>;

  forIn(config.api3!.entities, ({ name, actions }: any, entity: string) => {
    Reflect.defineProperty(client, entity, {
      get: () =>
        new RequestBuilder(
          name,
          (requestParams, requestOptions) =>
            request.bind(config)(requestParams, {
              ...config.requestOptions,
              ...requestOptions,
            }),
          actions,
        ),
    });
  });

  return client;
}
