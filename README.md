# CiviCRM API

JavaScript (and TypeScript) client for the [CiviCRM API](https://docs.civicrm.org/dev/en/latest/api/v4/usage/).

## Installation

```sh
npm install civicrm-api
```

## Usage

```ts
import { createClient } from "civicrm-api";

const client = createClient({
  baseUrl: "https://example.com/civicrm",
  auth: { apiKey: "<your-api-key>" },
  entities: { contact: "Contact" },
});

const contactRequest = client.contact.get({ where: { id: 1 } }).one();
```

### API v3

You can optionally create an [API v3](https://docs.civicrm.org/dev/en/latest/api/v3/) client by providing the relevant configuration:

```ts
const client = createClient({
  // ...
  api3: {
    enabled: true,
    entities: {
      contact: {
        name: "Contact",
        actions: {
          getList: "getlist",
        },
      },
    },
});

const contactsRequest = client.contact.getList();
```

## API

### `createClient(options: ClientOptions): Client`

Configure a CiviCRM API client.

#### options.baseUrl

The base URL of the CiviCRM installation.

#### options.auth

The API key, JWT, or username and password that will be used to authenticate requests. Refer to the [CiviCRM authentication](https://docs.civicrm.org/dev/en/latest/framework/authx/#authentication) documentation.

```ts
const client = createClient({
  // ...

  auth: { apiKey: "api-key" },
  //=> X-Civi-Auth: Bearer api-key

  auth: { jwt: "jwt" },
  //=> X-Civi-Auth: Bearer jwt

  auth: { username: "user", password: "pass" },
  //=> X-Civi-Auth: Basic dXNlcjpwYXNz
});
```

#### options.entities

An object containing entities the client will be used to make requests for. Keys
will be
used to reference the entity within the client, and values should match the
entity in CiviCRM:

```ts
const client = createClient({
  // ...
  entities: {
    contact: "Contact",
    activity: "Activity",
  },
});
```

#### options.requestOptions

Set default request options for all requests.

Accepts
the [same options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

Headers will be merged with the default headers.

#### options.debug

Enable logging request and response details to the console.

#### options.api3.enabled

Enable API v3 client.

```ts
const client = createClient({
  // ...
  api3: {
    enabled: true,
  },
});
```

#### options.api3.entities

An object containing entities and actions the API v3 client will be used to make requests for.
Keys will be used to reference the entity within the client. The value contains the name of the entity in API v3, and an object of actions, where the key is used to reference the action within the client, and the value is the action in API v3.

```ts
const client = createClient({
  // ...
  api3: {
    enabled: true,
    entities: {
      contact: {
        name: "Contact",
        actions: {
          getList: "getlist",
        },
      },
    },
  },
});
```

### `client.<entity>: Api4.RequestBuilder`

Create a request builder for a configured entity.

### Request builder

Request builders are used to build and execute requests.

Methods can be chained, and the request is executed by
calling `.then()` or starting a chain with `await`.

```ts
// Using .then()
client.contact
  .get({ where: { id: 1 } })
  .one()
  .then((contact) => {
    //
  });

// Using await
const contact = await client.contact.get({ where: { id: 1 } }).one();
```

#### `get(params?: Api4.Params): Api4.RequestBuilder`

#### `create(params?: Api4.Params): Api4.RequestBuilder`

#### `update(params?: Api4.Params): Api4.RequestBuilder`

#### `save(params?: Api4.Params): Api4.RequestBuilder`

#### `delete(params?: Api4.Params): Api4.RequestBuilder`

#### `getChecksum(params?: Api4.Params): Api4.RequestBuilder`

Set the action for the request to the method name, and optionally set request
parameters.

##### params

An object accepting parameters accepted by CiviCRM
including `select`, `where`, `having`, `join`,
`groupBy`, `orderBy`, `limit`, `offset` and `values`.

Alternatively accepts a key-value object for methods like `getChecksum`.

#### `one(): Api4.RequestBuilder`

Return a single record (i.e. set the index of the request to 0).

#### `chain(label: string, requestBuilder: Api4.RequestBuilder): Api4.RequestBuilder`

[Chain a request](https://docs.civicrm.org/dev/en/latest/api/v4/chaining/#apiv4-chaining)
for another entity within the current API call.

```ts
const contact = await client.contact
  .get({ where: { id: 1 } })
  .chain(
    "activity",
    client.activity.get({ where: { target_contact_id: "$id" } }),
  )
  .one();

console.log(contact);
// => { id: 1, activity: [{ target_contact_id: 1, ... }], ... }
```

##### label

The label for the chained request, which will be used access the result of the
chained request within the response.

##### requestBuilder

A request builder for the chained request.

#### `options(requestOptions: RequestInit): Api4.RequestBuilder`

Set request options.

#### requestOptions

Accepts
the [same options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

Headers will be merged with the default headers.

```ts
client.contact.get().options({
  headers: {
    "X-Custom-Header": "value",
  },
  cache: "no-cache",
});
```

## `client.api3.<entity>: Api3.RequestBuilder`

Create an API v3 request builder for a configured entity.

### Request builder

Request builders are used to build and execute requests.

Methods can be chained, and the request is executed by
calling `.then()` or starting a chain with `await`.

```ts
// Using .then()
client.api3.contact.getList({ input: "example" }).then((contacts) => {
  //
});

// Using await
const contacts = await client.getList({ input: "example" });
```

#### `<action>(params?: Api3.Params): Api3.RequestBuilder`

Set the action for the request, and optionally set request parameters.

#### `addOption(option: string, value: Api3.Value): Api3.RequestBuilder`

Set [API options](https://docs.civicrm.org/dev/en/latest/api/v3/options/).

```ts
client.api3.contact.getList().addOption("limit", 10);
```

#### `options(requestOptions: RequestInit): Api3.RequestBuilder`

Set request options.

#### requestOptions

Accepts
the [same options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

Headers will be merged with the default headers.

```ts
client.api3.contact.getList().options({
  headers: {
    "X-Custom-Header": "value",
  },
  cache: "no-cache",
});
```

## Alternatives

- The [civicrm](https://www.npmjs.com/package/civicrm) package from [Tech to The People](https://github.com/TechToThePeople) offers a different approach to building requests.

## Development

### Install dependencies

```sh
npm install
```

### Run tests

```sh
npm test
```

### Build the package

```sh
npm run build
```

### Releasing

1. Increment the version number and create a tag:

   ```sh
   npm version <major|minor|patch|prerelease>
   ```

2. Push the tag to GitHub:

   ```sh
   git push --tags
   ```

3. [Create a release](https://github.com/socialistalternative/civicrm-api/releases/new)
   on GitHub. The package will be built and published to npm automatically by
   GitHub Actions.
