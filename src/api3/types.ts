import { RequestBuilder } from "./request-builder";
import { BaseRequestFn } from "../types";

export namespace Api3 {
  export type EntitiesConfig = {
    [key: string]: {
      name: string;
      actions: {
        [key: string]: string;
      };
    };
  };

  export type Actions = {
    [key: string]: string;
  };
  export type ActionMethods<A extends Actions> = Record<
    keyof A,
    (params?: Api3.Params) => RequestBuilder<A>
  >;

  export type Client<E extends EntitiesConfig> = {
    [K in keyof E]: RequestBuilder<E[K]["actions"]> &
      ActionMethods<E[K]["actions"]>;
  };

  export type Value =
    | string
    | number
    | string[]
    | number[]
    | boolean
    | boolean[]
    | null;

  export type Params = Record<string, Value>;
  export type Options = Record<string, Value>;

  export type RequestParams = [string, string, Params?, Options?];
  export type RequestFn<Response> = BaseRequestFn<RequestParams, Response>;
}
