import forIn from "lodash.forin";

import { request } from "./request";
import { Api4 } from "./types";
import { RequestBuilder } from "./request-builder";
import { ClientConfig } from "../types";
import { bindRequest } from "../lib/request";

export function createApi4Client<E extends Api4.EntitiesConfig>(
  config: ClientConfig<E, any>,
) {
  const boundRequest = bindRequest(request, config);

  const client = {} as Api4.Client<E>;

  forIn(config.entities, (entity: string, key: string) => {
    Reflect.defineProperty(client, key, {
      get: () => new RequestBuilder(entity, boundRequest),
    });
  });

  return client;
}
