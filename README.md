# @financial-times/biz-ops-client

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/biz-ops-client/master.svg)](https://circleci.com/gh/Financial-Times/biz-ops-client) [![NPM version](https://img.shields.io/npm/v/@financial-times/biz-ops-client.svg)](https://www.npmjs.com/package/@financial-times/biz-ops-client)

Safely send and retrieve data from the [FT Biz Ops API][1].

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

[1]: https://github.com/Financial-Times/biz-ops-api#api

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

All methods return a promise. If the API responds with any unsuccessful (non-20x) status code the promise will be rejected with the corresponding [HTTP error](#errors).

#### `graphQL.get(query: string, variables?: object)`

Fetches data from the Biz Ops GraphQL API using a `GET` request. You should use this if data does not need to be up-to-date. Resolves to the data returned. Rejects with a [`GraphQLError`](#errors) if the returned data includes any errors.

#### `graphQL.post(query: string, variables?: object)`

Fetches data from the Biz Ops GraphQL API using a `POST` request. You should use this if data must always be up-to-date. Resolves to the data returned. Reject with a [`GraphQLError`](#errors) if the returned data includes any errors.

#### `node.head(type: string, code: string)`

Verifies if a record exists. Resolves to `true` if the request is successful. Rejects with a [`NotFound`](#errors) error if the requested record cannot be found.

#### `node.post(type: string, code: string, body: object, options?: object)`

Creates a new record. Resolves to `true` if the request is successful. Rejects with a [`ValidationError`](#errors) if the new data does not match the [schema].

#### `node.patch(type: string, code: string, body: object, options?: object)`

Updates an existing record. Resolves to `true` if the request is successful. Rejects with a [`ValidationError`](#errors) if the updated data does not match the [schema].

#### `node.delete(type: string, code: string, options?: object)`

Deletes an existing record. Resolves to `true` if the request is successful. Rejects with a [`NotFound`](#errors) error if the requested record cannot be found.

[schema]: https://github.com/Financial-Times/biz-ops-schema/tree/master/schema

## Errors

### `HTTPError`

All non-20x responses will throw a corresponding error created by the [`http-errors`](https://www.npmjs.com/package/http-errors) package. If the API returns a detailed error this will be used as the error message. The raw response may be appended to the error as a `response` property for further inspection.

### `ConfigurationError`

Will be thrown when initialising the `BizOpsClient` class with incomplete configuration or when calling methods with incorrect arguments.

### `ValidationError`

TODO

### `GraphQLError`

Thrown when responses from the GraphQL API include any [errors](https://github.com/graphql/graphql-spec/blob/master/spec/Section%207%20--%20Response.md#errors). This includes a `details` property which can be inspected to find out more.
