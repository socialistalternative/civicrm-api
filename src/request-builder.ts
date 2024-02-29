import { isEmpty, mapValues } from "lodash-es";
import {
  Action,
  Entity,
  Index,
  Params,
  RequestFn,
  RequestParams,
} from "./types";

export class RequestBuilder<T = any> implements PromiseLike<T> {
  private readonly entity: Entity;
  private readonly request: RequestFn<T>;
  private innerPromise: Promise<T>;
  private action: Action;
  private params?: Params;
  private index?: Index;
  private chains: Record<string, RequestBuilder> = {};
  private requestOptions: RequestInit = {};

  constructor(entity: string, request: RequestFn<T>) {
    this.entity = entity;
    this.request = request;
  }

  get requestParams(): RequestParams {
    const params: Params = { ...this.params };

    if (!isEmpty(this.chains)) {
      params.chain = mapValues(
        this.chains,
        (chainRequest: RequestBuilder) => chainRequest.requestParams,
      );
    }

    return [this.entity, this.action, params, this.index];
  }

  get(params?: Params) {
    this.action = Action.get;
    this.params = params;

    return this;
  }

  create(params?: Params) {
    this.action = Action.create;
    this.params = params;

    return this;
  }

  update(params?: Params) {
    this.action = Action.update;
    this.params = params;

    return this;
  }

  save(params?: Params) {
    this.action = Action.save;
    this.params = params;

    return this;
  }

  delete(params?: Params) {
    this.action = Action.delete;
    this.params = params;

    return this;
  }

  getChecksum(params?: Params) {
    this.action = Action.getChecksum;
    this.params = params;

    return this;
  }

  one() {
    this.index = 0;

    return this;
  }

  options(requestOptions: RequestInit) {
    this.requestOptions = requestOptions;

    return this;
  }

  chain(label: string, requestBuilder: RequestBuilder) {
    this.chains[label] = requestBuilder;

    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onRejected?:
      | ((reason: Error) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.getInnerPromise().then(onFulfilled, onRejected);
  }

  getInnerPromise() {
    if (!this.innerPromise) {
      this.innerPromise = this.request(this.requestParams, this.requestOptions);
    }

    return this.innerPromise;
  }
}
