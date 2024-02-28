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

  constructor(entity: string, request: RequestFn<T>) {
    this.entity = entity;
    this.request = request;
  }

  get requestParams(): RequestParams {
    return [this.entity, this.action, this.params, this.index];
  }

  get(params: Params) {
    this.action = Action.get;
    this.params = params;

    return this;
  }

  one() {
    this.index = 0;

    return this;
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?:
      | ((value: any) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onRejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.getInnerPromise().then(onFulfilled, onRejected);
  }

  getInnerPromise() {
    if (!this.innerPromise) {
      this.innerPromise = this.request(this.requestParams);
    }

    return this.innerPromise;
  }
}
