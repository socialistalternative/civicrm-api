import { isEmpty } from "lodash-es";

import { RequestParams } from "./types";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
  },
  [entity, action, params, index]: RequestParams,
  { headers, ...requestOptions }: RequestInit = {},
) {
  const requestId = crypto.randomUUID();

  const url = new URL(`civicrm/ajax/api4/${entity}/${action}`, this.baseUrl);

  if (!isEmpty(params)) {
    url.search = new URLSearchParams({
      params: JSON.stringify(params),
    }).toString();
  }

  if (index !== undefined) {
    url.searchParams.append("index", String(index));
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      "X-Request-ID": requestId,
      ...headers,
    },
    ...requestOptions,
  });

  if (!res.ok) {
    throw new Error(`CiviCRM request failed: ${await res.text()}`);
  }

  const json = await res.json();

  return json.values;
}
