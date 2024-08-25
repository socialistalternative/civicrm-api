import forIn from "lodash.forin";

import { Api3 } from "./types";
import { RequestBuilder as BaseRequestBuilder } from "../lib/request-builder";

export class RequestBuilder<
  A extends Api3.Actions,
  Response = any,
> extends BaseRequestBuilder<Api3.RequestParams, Response> {
  private action: string;
  private params?: Api3.Params;
  private options: Record<string, Api3.Value> = {};

  constructor(entity: string, request: Api3.RequestFn<Response>, actions: A) {
    super(entity, request);

    forIn(actions, (action: string, key: string) => {
      this[key] = (params?: Api3.Params) => {
        this.action = action;
        this.params = params;

        return this;
      };
    });
  }

  get requestParams(): Api3.RequestParams {
    return [this.entity, this.action, this.params, this.options];
  }

  option(option: string, value: Api3.Value) {
    this.options[option] = value;

    return this;
  }
}
