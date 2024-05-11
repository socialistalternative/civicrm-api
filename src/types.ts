import { Api4 } from "./api4/types";
import { Api3 } from "./api3/types";

export type Client<
  E extends Api4.EntitiesConfig,
  F extends Api3.EntitiesConfig,
> = Api4.Client<E> & {
  api3: Api3.Client<F>;
};

export type Authentication =
  | { apiKey: string }
  | { jwt: string }
  | { username: string; password: string };

export type RequestOptions = RequestInit;

export interface ClientConfig<
  E extends Api4.EntitiesConfig,
  F extends Api3.EntitiesConfig,
> {
  baseUrl: string;
  auth?: Authentication;
  entities?: E;
  requestOptions?: RequestOptions;
  debug?: boolean;
  api3?: {
    enabled: boolean;
    entities: F;
  };
}

export type BaseRequestFn<RequestParams, Response> = (
  params: RequestParams,
  requestOptions: RequestOptions,
  auth?: Authentication,
) => Promise<Response>;
