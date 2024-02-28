# CiviCRM API

JavaScript/TypeScript client for CiviCRM API v4.

## Installation

> [!WARNING]
> This package is under development and not yet published to npm.

```sh
npm install package-name-tbd
```

## Usage

> [!NOTE]
> Usage documentation is a work in progress.

### Create a client

```ts
import { createClient } from 'package-name-tbd';

const client = createClient({
  baseUrl: 'https://example.com/civicrm',
  apiKey: 'your-api-key',
});
```

### Make a request

```ts
const contact = await client.contact().get({ where: { id: 1 } }).one();
```

## Development

> [!NOTE]
> Development documentation is a work in progress.

### Setup

```sh
npm install
```

### Testing

```sh
npm test
```

### Building

```sh
npm run build
```
