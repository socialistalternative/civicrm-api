import { forIn } from "lodash-es";

import { request } from "./request";
import { Api3 } from "./types";
import { RequestBuilder } from "./request-builder";
import { ClientConfig } from "../types";
import { bindRequest } from "../lib/request";

export function createApi3Client<E extends Api3.EntitiesConfig>(
  config: ClientConfig<any, E>,
) {
  const client = {
    request: bindRequest(request, config),
  } as Api3.Client<E>;

  forIn(
    config.api3!.entities,
    ({ name, actions }: Api3.EntityConfig, entity: string) => {
      Reflect.defineProperty(client, entity, {
        get: () => new RequestBuilder(name, client.request, actions),
      });
    },
  );

  return client;
}
