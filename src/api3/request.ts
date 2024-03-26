import { isEmpty } from "lodash-es";

import { Api3 } from "./types";
import { request as baseRequest } from "../lib/request";

const path = "civicrm/ajax/rest";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
    debug?: boolean;
  },
  [entity, action, params, options]: Api3.RequestParams,
  requestOptions: RequestInit = {},
) {
  const json = isEmpty(options) ? { ...params } : { ...params, options };

  const searchParams = new URLSearchParams({
    entity: entity,
    action: action,
    json: JSON.stringify(json),
  });

  return baseRequest.bind(this)(path, searchParams, requestOptions);
}
