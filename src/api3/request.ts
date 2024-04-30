import isEmpty from "lodash/isEmpty";

import { Api3 } from "./types";
import { request as baseRequest } from "../lib/request";
import { Authentication } from "../types";

const path = "civicrm/ajax/rest";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
    debug?: boolean;
  },
  [entity, action, params, options]: Api3.RequestParams,
  requestOptions: RequestInit = {},
  auth?: Authentication,
) {
  const json = isEmpty(options) ? { ...params } : { ...params, options };

  const searchParams = new URLSearchParams({
    entity: entity,
    action: action,
    json: JSON.stringify(json),
  });

  return baseRequest.bind(this)(path, searchParams, requestOptions, auth);
}
