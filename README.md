# @financial-times/biz-ops-client

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/biz-ops-client/master.svg)](https://circleci.com/gh/Financial-Times/biz-ops-client) [![NPM version](https://img.shields.io/npm/v/@financial-times/biz-ops-client.svg)](https://www.npmjs.com/package/@financial-times/biz-ops-client)

A thin wrapper around the [Fetch API][1] to safely retrieve data from the [Biz Ops GraphQL API][2].

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const bizOps = new BizOpsClient(options);

const query = `{
	System(code: "my-system") {
		name
		supportedBy {
			slack
		}
	}
}`;

const result = await bizOps.request(query);
```

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[2]: https://biz-ops.in.ft.com/api-explorer


## Installation

This is package for [Node.js] and is available through the [npm] registry. Node 12 or higher is required.

Installation is done using the [npm install] command:

```bash
npm install -S @financial-times/biz-ops-client
```

[Node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally


## Features

- Stop writing boilerplate, write your queries and get on with your day!
- Detailed error codes and messages when things don't go to plan
- Optionally supports in-memory caching of response data


## Usage

This module provides a single `BizOpsClient` class which must initialised and configured using [options](#options).

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const client = new BizOpsClient({
	apiKey: 'xxxx-xxxx-xxxx',
	systemCode: 'my-great-app',
});
```

The Biz Ops client provides [methods](#api) to retrieve data from the Biz Ops GraphQL API.

### Options

The `BizOpsClient` class accepts the following parameters:

| Option        | Type   | Required | Description                                                                                                                                   |
|---------------|--------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `apiKey`      | String | Yes      | API key for the [FT API Gateway](http://developer.ft.com)                                                                                     |
| `systemCode`  | String | Yes      | A Biz Ops system code which identifies the service making requests                                                                            |
| `cacheLength` | Number |          | Time in milliseconds to store successful responses in memory, defaults to 1 minute if `NODE_ENV` is set to `"production"` otherwise disabled. |
| `endpoint`    | String |          | URL for the Biz Ops GraphQL API, defaults to `"https://api.ft.com/biz-ops/graphql"`.                                                          |

### API

#### `request(query: string, variables?: object)`

Returns a promise which will resolve with the data returned from the GraphQL API. If the API request fails or the response data includes an error this will throw an `Error`.


## Examples

### Overriding options

```js
request(query, null, {})
```

### Using variables

```js
request(query, {})
```

### Error handling

```js
try {
	await request(query)
} catch (error) {
	console.error(error.code)
}
```