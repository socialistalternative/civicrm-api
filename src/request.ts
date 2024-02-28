import { randomUUID } from "crypto";

import { RequestParams } from "./types";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
  },
  [entity, action, params, index]: RequestParams,
) {
  const requestId = randomUUID();

  const url = new URL(`civicrm/ajax/api4/${entity}/${action}`, this.baseUrl);

  url.search = new URLSearchParams({
    params: JSON.stringify(params),
  }).toString();

  if (index !== undefined) {
    url.searchParams.append("index", String(index));
  }

  const headers = {
    Authorization: `Bearer ${this.apiKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    "X-Request-ID": requestId,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    // TODO: accept fetch options
    // cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`CiviCRM request failed: ${await res.text()}`);
  }
  
  const json = await res.json();

  return json.values;
}
