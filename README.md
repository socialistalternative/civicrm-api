# CiviCRM API

JavaScript/TypeScript client for CiviCRM API v4.

## Installation

```sh
npm install civicrm-api
```

## Usage

```ts
import { createClient } from "civicrm-api";

const client = createClient({
  baseUrl: "https://example.com/civicrm",
  apiKey: "your-api-key",
  entities: { contact: "Contact" },
});

const contactRequest = client
  .contact()
  .get({ where: { id: 1 } })
  .one();
```

## API

### `createClient(options: ClientOptions): Client`

Configure a CiviCRM API client.

#### options.baseUrl

The base URL of the CiviCRM installation.

#### options.apiKey

The [API key](https://docs.civicrm.org/sysadmin/en/latest/setup/api-keys/) to
use for authentication.

#### options.entities

An object containing entities the client will be used to make requests for. Keys
will be
used to reference the entity within the client, and values should match the
entity in CiviCRM:

```ts
const client = createClient({
  entities: {
    contact: "Contact",
    activity: "Activity",
  },
});
```

### `client.<entity>(requestOptions?: RequestInit): RequestBuilder`

Create a request builder for a configured entity.

#### requestOptions

Accepts
the [same options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options).

Headers will be merged with the default headers.

```ts
client.contact({
  headers: {
    "X-Custom-Header": "value",
  },
  cache: "no-cache",
});
```

### Request builder

Request builders are used to build and execute requests.

Methods can be chained, and the request is executed by
calling `.then()` or starting a chain with `await`.

```ts
// Using .then()
client
  .contact()
  .get({ where: { id: 1 } })
  .one()
  .then((contact) => {
    //
  });

// Using await
const contact = await client
  .contact()
  .get({ where: { id: 1 } })
  .one();
```

#### `get(params?: Params): RequestBuilder`

#### `create(params?: Params): RequestBuilder`

#### `update(params?: Params): RequestBuilder`

#### `save(params?: Params): RequestBuilder`

#### `delete(params?: Params): RequestBuilder`

#### `getChecksum(params?: Params): RequestBuilder`

Set the action for the request to the method name, and optionally set request
parameters.

##### params

An object accepting parameters accepted by CiviCRM
including `select`, `where`, `having`, `join`,
`groupBy`, `orderBy`, `limit`, `offset` and `values`.

Alternatively accepts a key-value object for methods like `getChecksum`.

#### `one(): RequestBuilder`

Return a single record (i.e. set the index of the request to 0).

#### `chain(label: string, requestBuilder: RequestBuilder): RequestBuilder`

[Chain a request](https://docs.civicrm.org/dev/en/latest/api/v4/chaining/#apiv4-chaining)
for another entity within the current API call.

```ts
const contact = await client
  .contact()
  .get({ where: { id: 1 } })
  .chain(
    "activity",
    client.activity().get({ where: { target_contact_id: "$id" } }),
  )
  .one();

console.log(contact);
// => { id: 1, activity: [{ target_contact_id: 1, ... }], ... }
```

#### label

The label for the chained request, which will be used access the result of the
chained request within the response.

#### requestBuilder

A request builder for the chained request.

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
