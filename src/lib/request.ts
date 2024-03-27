import { bold, gray, yellow } from "picocolors";
import { AuthenticationConfig, ClientConfig } from "../types";

function authenticationHeader(auth: AuthenticationConfig): string {
  if ("apiKey" in auth) {
    return `Bearer ${auth.apiKey}`;
  }

  if ("jwt" in auth) {
    return `Bearer ${auth.jwt}`;
  }

  if ("username" in auth) {
    return `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
  }

  throw new Error("auth must contain apiKey, jwt, or username/password");
}

function handleError(error: string) {
  if (this.debug) {
    console.error(error);
    console.groupEnd();
  }

  // TODO: make this error more informative
  throw new Error("CiviCRM request failed");
}

export async function request(
  this: ClientConfig<any, any>,
  path: string,
  params?: URLSearchParams,
  { headers, ...requestOptions }: RequestInit = {},
) {
  const requestId = crypto.randomUUID();

  const url = new URL(path, this.baseUrl);

  if (params) {
    url.search = params.toString();
  }

  const start = performance.now();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Civi-Auth": authenticationHeader(this.auth),
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
    handleError.call(this, error);
  }

  const json = await res.json();

  if (json.is_error) {
    handleError.call(this, json);
  }

  if (this.debug) {
    console.groupEnd();
  }

  return json.values;
}
