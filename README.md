# @financial-times/biz-ops-client

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/biz-ops-client/master.svg)](https://circleci.com/gh/Financial-Times/biz-ops-client) [![NPM version](https://img.shields.io/npm/v/@financial-times/biz-ops-client.svg)](https://www.npmjs.com/package/@financial-times/biz-ops-client)

Safely send and retrieve data from the [FT Biz Ops API][2].

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

const result = await bizOps.graphQL.get(query);
```

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[2]: https://biz-ops.in.ft.com/api-explorer

## Installation

This is package for [Node.js] and is available through the [npm] registry. Node 12 or higher is required.

Installation is done using the [npm install] command:

```bash
npm install -S @financial-times/biz-ops-client
```

[node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Features

-   Full coverage for the Biz Ops API\*
-   Stop writing boilerplate, write your requests and get on with your day!
-   Detailed error codes and messages when things don't go to plan

\* Coming soon!

## Usage

This module provides a single `BizOpsClient` class which must initialised and configured using [options](#options).

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const client = new BizOpsClient({
	apiKey: 'xxxx-xxxx-xxxx',
	systemCode: 'my-great-app',
});
```

Once initialised the Biz Ops client provides [methods](#api) to retrieve data from the Biz Ops API.

### Options

The `BizOpsClient` class accepts the following parameters:

| Option       | Type   | Required | Description                                                          |
| ------------ | ------ | -------- | -------------------------------------------------------------------- |
| `apiKey`     | String | Yes      | API key for the [FT API Gateway](http://developer.ft.com)            |
| `systemCode` | String | Yes\*    | A Biz Ops system code which identifies the service making requests.  |
| `userID`     | String | Yes\*    | A user ID which identifies who is making a request                   |
| `host`       | String |          | URL for the Biz Ops API, defaults to `"https://api.ft.com/biz-ops"`. |

\* you must configure at least one of `systemCode` or `userID`.

### API

All methods return a promise. If the API responds with an unsuccessful status code an appropriate [HTTP error](#errors) will be thrown.

#### `graphQL.get(query: string, variables?: object)`

Fetches data from the Biz Ops GraphQL API using a `GET` request. You should use this if data does not need to be up-to-date. Returns a promise which will resolve to the data returned. Will throw a [`GraphQLError`](#errors) if the returned data includes any errors.

#### `graphQL.post(query: string, variables?: object)`

Fetches data from the Biz Ops GraphQL API using a `POST` request. You should use this if data must always be up-to-date. Returns a promise which will resolve to the data returned. Will throw a [`GraphQLError`](#errors) if the returned data includes any errors.

## Errors

### `HTTPError`

All non-200 responses will throw an error created by the [`http-errors`](https://www.npmjs.com/package/http-errors) package.

### `ConfigurationError`

Will be thrown when initialising the `BizOpsClient` class with incomplete configuration or when calling methods with incorrect arguments.

### `NotImplementedError`

TODO

### `GraphQLError`

Thrown when responses for the GraphQL API includes any [errors](https://github.com/graphql/graphql-spec/blob/master/spec/Section%207%20--%20Response.md#errors). These errors include a `details` property which can be inspected to find out more.
