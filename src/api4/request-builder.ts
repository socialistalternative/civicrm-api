import { isEmpty, mapValues } from "lodash-es";

import { Api4 } from "./types";
import { RequestBuilder as BaseRequestBuilder } from "../lib/request-builder";

export class RequestBuilder<Response = any> extends BaseRequestBuilder<
  Api4.RequestParams,
  Response
> {
  private action: Api4.Action;
  private params?: Api4.Params;
  private index?: Api4.Index;
  private chains: Record<string, RequestBuilder> = {};

  constructor(entity: string, request: Api4.RequestFn<Response>) {
    super(entity, request);
  }

  get requestParams(): Api4.RequestParams {
    const params: Api4.Params = { ...this.params };

    if (!isEmpty(this.chains)) {
      params.chain = mapValues(
        this.chains,
        (chainRequest: RequestBuilder) => chainRequest.requestParams,
      );
    }

    return [this.entity, this.action, params, this.index];
  }

  get(params?: Api4.Params) {
    this.action = Api4.Action.get;
    this.params = params;
    this.requestOptions({ method: "GET" });

    return this;
  }

  create(params?: Api4.Params) {
    this.action = Api4.Action.create;
    this.params = params;

    return this;
  }

  update(params?: Api4.Params) {
    this.action = Api4.Action.update;
    this.params = params;

    return this;
  }

  save(params?: Api4.Params) {
    this.action = Api4.Action.save;
    this.params = params;

    return this;
  }

  delete(params?: Api4.Params) {
    this.action = Api4.Action.delete;
    this.params = params;

    return this;
  }

  getChecksum(params?: Api4.Params) {
    this.action = Api4.Action.getChecksum;
    this.params = params;

    return this;
  }

  validateChecksum(params?: Api4.Params) {
    this.action = Api4.Action.validateChecksum;
    this.params = params;

    return this;
  }

  validate(params?: Api4.Params) {
    this.action = Api4.Action.validate;
    this.params = params;

    return this;
  }

  autocomplete(params?: Api4.Params) {
    this.action = Api4.Action.autocomplete;
    this.params = params;
    this.requestOptions({ method: "GET" });

    return this;
  }

  one() {
    this.index = 0;

    return this;
  }

  chain(label: string, requestBuilder: RequestBuilder) {
    this.chains[label] = requestBuilder;

    return this;
  }
}
