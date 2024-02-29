import { RequestBuilder } from "./request-builder";

export type EntitiesConfig = Record<string, string>;

export interface ClientConfig<E extends EntitiesConfig> {
  baseUrl: string;
  apiKey: string;
  entities: E;
  requestOptions?: RequestInit;
}

export type Client<E extends EntitiesConfig> = {
  [K in keyof E]: RequestBuilder;
};

export type Entity = string;

export enum Action {
  get = "get",
  create = "create",
  update = "update",
  save = "save",
  delete = "delete",
  getChecksum = "getChecksum",
}

export type Field = string;
export type Value =
  | string
  | number
  | string[]
  | number[]
  | boolean
  | boolean[]
  | null;

type Many<T> = T | readonly T[];

type WhereOperator =
  | "="
  | "<="
  | ">="
  | ">"
  | "<"
  | "LIKE"
  | "<>"
  | "!="
  | "NOT LIKE"
  | "IN"
  | "NOT IN"
  | "BETWEEN"
  | "NOT BETWEEN"
  | "IS NOT NULL"
  | "IS NULL"
  | "CONTAINS"
  | "NOT CONTAINS"
  | "IS EMPTY"
  | "IS NOT EMPTY"
  | "REGEXP"
  | "NOT REGEXP";

type Where =
  | [Field, WhereOperator, Value?]
  | ["OR", [Field, WhereOperator, Value?]];

type Order = "ASC" | "DESC";

type JoinOperator = "LEFT" | "RIGHT" | "INNER" | "EXCLUDE";

type Join =
  | [Entity, JoinOperator, Entity, ...Many<Where>]
  | [Entity, JoinOperator, ...Many<Where>];

export type Params =
  | {
      select?: Field[];
      where?: Where[];
      having?: Where[];
      join?: Join[];
      groupBy?: Field[];
      orderBy?: Record<Field, Order>;
      limit?: number;
      offset?: number;
      values?: Record<Field, Value>;
      chain?: Record<string, RequestParams>;
    }
  | Record<Field, Value>;

export type Index = number;

export type RequestParams = [Entity, Action, Params?, Index?];
export type RequestFn<T> = (
  params: RequestParams,
  requestOptions: RequestInit,
) => Promise<T>;
