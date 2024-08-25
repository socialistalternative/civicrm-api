import forIn from "lodash.forin";

import { request } from "./request";
import { Api3 } from "./types";
import { RequestBuilder } from "./request-builder";
import { ClientConfig } from "../types";
import { bindRequest } from "../lib/request";

export function createApi3Client<E extends Api3.EntitiesConfig>(
  config: ClientConfig<any, E>,
) {
  const boundRequest = bindRequest(request, config);

  const client = {} as Api3.Client<E>;

  forIn(config.api3!.entities, (entity: Api3.EntityConfig, key: string) => {
    Reflect.defineProperty(client, key, {
      get: () => new RequestBuilder(entity.name, boundRequest, entity.actions),
    });
  });

  return client;
}
