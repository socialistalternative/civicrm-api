import { BaseRequestFn } from "../types";

export class RequestBuilder<RequestParams = any, T = any>
  implements PromiseLike<T>
{
  protected readonly entity: string;
  protected readonly request: BaseRequestFn<RequestParams, T>;
  protected innerPromise: Promise<T>;
  protected requestOptions: RequestInit = {};

  constructor(entity: string, request: BaseRequestFn<RequestParams, T>) {
    this.entity = entity;
    this.request = request;
  }

  options(requestOptions: RequestInit) {
    this.requestOptions = requestOptions;

    return this;
  }

  get requestParams(): RequestParams {
    throw new Error();
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
