import { BaseRequestFn } from "../types";
import { RequestBuilder } from "./request-builder";

export namespace Api4 {
  export type EntitiesConfig = Record<string, string>;

  export type Client<E extends EntitiesConfig> = {
    [K in keyof E]: RequestBuilder;
  };

  export enum Action {
    get = "get",
    create = "create",
    update = "update",
    save = "save",
    delete = "delete",
    getChecksum = "getChecksum",
    autocomplete = "autocomplete",
  }

  export type Value =
    | string
    | number
    | string[]
    | number[]
    | boolean
    | boolean[]
    | null
    | Date
    | undefined;

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
    | [string, WhereOperator, Value?]
    | ["OR", [string, WhereOperator, Value?][]];

  type Order = "ASC" | "DESC";

  type JoinOperator = "LEFT" | "RIGHT" | "INNER" | "EXCLUDE";

  type Join =
    | [string, JoinOperator, string, ...Many<Where>]
    | [string, JoinOperator, ...Many<Where>];

  export type Params =
    | {
        select?: string[];
        where?: Where[];
        having?: Where[];
        join?: Join[];
        groupBy?: string[];
        orderBy?: Record<string, Order>;
        limit?: number;
        offset?: number;
        values?: Record<string, Value>;
        chain?: Record<string, RequestParams>;
        records?: Record<string, Value>[];
        defaults?: Record<string, Value>;
        match?: string[];
      }
    | Record<string, Value>;

  export type Index = number;

  export type RequestParams = [string, Action, Params?, Index?];
  export type RequestFn<Response> = BaseRequestFn<RequestParams, Response>;
}
