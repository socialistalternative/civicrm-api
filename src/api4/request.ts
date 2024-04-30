import isEmpty from "lodash/isEmpty";

import { Api4 } from "./types";
import { request as baseRequest } from "../lib/request";
import { Authentication } from "../types";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
    debug?: boolean;
  },
  [entity, action, params, index]: Api4.RequestParams,
  requestOptions: RequestInit = {},
  auth?: Authentication,
) {
  const path = `civicrm/ajax/api4/${entity}/${action}`;
  const searchParams = new URLSearchParams();

  if (!isEmpty(params)) {
    searchParams.append("params", JSON.stringify(params));
  }

  if (index !== undefined) {
    searchParams.append("index", String(index));
  }

  return baseRequest.bind(this)(path, searchParams, requestOptions, auth);
}
