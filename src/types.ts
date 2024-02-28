import { RequestBuilder } from "./request-builder";

export type EntitiesConfig = Record<string, string>;

export interface ClientConfig<E extends EntitiesConfig> {
  baseUrl: string;
  apiKey: string;
  entities: E;
}

export type Client<E extends EntitiesConfig> = {
  [K in keyof E]: RequestBuilder;
};

export type Entity = string;

export enum Action {
  get = "get",
}

export type Params = {
  select?: string[];
  where?: [string, string, any][];
};

export type Index = number;

export type RequestParams = [Entity, Action, Params?, Index?];
export type RequestFn<T> = (params: RequestParams) => Promise<T>;
