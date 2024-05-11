import { Authentication, BaseRequestFn, RequestOptions } from "../types";

export class RequestBuilder<RequestParams = any, T = any>
  implements PromiseLike<T>
{
  protected readonly entity: string;
  protected readonly request: BaseRequestFn<RequestParams, T>;
  protected innerPromise: Promise<T>;
  protected _requestOptions: RequestOptions = {};
  protected _auth: Authentication;

  constructor(entity: string, request: BaseRequestFn<RequestParams, T>) {
    this.entity = entity;
    this.request = request;
  }

  requestOptions(requestOptions: RequestOptions) {
    this._requestOptions = requestOptions;

    return this;
  }

  auth(auth: Authentication) {
    this._auth = auth;

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
      this.innerPromise = this.request(
        this.requestParams,
        this._requestOptions,
        this._auth,
      );
    }

    return this.innerPromise;
  }
}
