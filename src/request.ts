import { isEmpty } from "lodash-es";
import { bold, gray, yellow } from "picocolors";

import { RequestParams } from "./types";

export async function request(
  this: {
    baseUrl: string;
    apiKey: string;
    debug?: boolean;
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

  const start = performance.now();

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

  if (this.debug) {
    const time = `${Math.round(performance.now() - start)}ms`;

    console.group(
      `${bold("CiviCRM request")} ${requestId} ${gray(res.url)} ${res.status} in ${yellow(time)}`,
    );
  }

  if (!res.ok) {
    const error = await res.text();

    if (this.debug) {
      console.error(error);
      console.groupEnd();
    }

    throw new Error("CiviCRM request failed");
  }

  const json = await res.json();

  if (this.debug) {
    console.groupEnd();
  }

  return json.values;
}
