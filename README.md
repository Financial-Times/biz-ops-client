# @financial-times/biz-ops-client

[![CircleCI](https://img.shields.io/circleci/project/github/Financial-Times/biz-ops-client/main.svg)](https://circleci.com/gh/Financial-Times/biz-ops-client) [![NPM version](https://img.shields.io/npm/v/@financial-times/biz-ops-client.svg)](https://www.npmjs.com/package/@financial-times/biz-ops-client)

Safely send and retrieve data from the [FT Biz Ops API][1].

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const bizOps = new BizOpsClient(options);

const query = `{
	systems(where: { code: "my-system" }) {
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

This is package for [Node.js] and is available through the [npm] registry. Using Node 18 or higher is recommended.

Installation is done using the [npm install] command:

```bash
npm install -S @financial-times/biz-ops-client
```

[node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Features

-   Full coverage for the Biz Ops API
-   Stop writing boilerplate, write your requests and get on with your day!
-   Respects rate limits and sets required headers automatically
-   Detailed error codes and messages when things don't go to plan

## Usage

This module provides a single `BizOpsClient` class which must initialised and configured using [options](#options).

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const client = new BizOpsClient({
	apiKey: 'xxxx-xxxx-xxxx',
	systemCode: 'my-great-app',
});
```

Once initialised the Biz Ops client provides [methods](#api) to send and retrieve data from the Biz Ops API.

### Options

The `BizOpsClient` class accepts the following parameters:

| Option            | Type   | Required | Description                                                                                         |
| ----------------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| `apiKey`          | String | Yes      | API key for the [FT API Gateway](http://developer.ft.com)                                           |
| `systemCode`      | String | Yes\*    | A Biz Ops system code which identifies the service making requests.                                 |
| `userID`          | String | Yes\*    | A user ID which identifies who is making a request                                                  |
| `host`            | String |          | URL for the Biz Ops API, defaults to `"https://api.ft.com/biz-ops"`.                                |
| `nodeEndpoint`    | String | \*\*     | URL for the Biz Ops API node requests, defaults to `/v2/node`.                                      |
| `graphqlEndpoint` | String | \*\*     | URL for the Biz Ops API graphql requests, defaults to `/graphql`.                                   |
| `timeout`         | Number |          | Maximum time in milliseconds to wait for a response, defaults to `15000`                            |
| `rps`             | Number |          | Maximum number of API requests per second, defaults to `18` - highly recommended not to change this |

\* you must configure at least one of `systemCode` or `userID`.

\*\* once in a while when we carry out a migration/upgrade we may ask you to use a versioned endpoint during the transition period. e.g. `graphqlEndpoint='/v3/graphql'`

### API

All methods return a promise. If the API responds with an unsuccessful (non-20x) status code then the promise will be rejected with a corresponding [HTTP error](#errors). Please note that requests are rate limited by this client to match the Biz Ops API which accepts a maximum of 20 requests per second.

#### `graphQL.get(query: string, variables?: object, strict?: boolean)`

Fetches data from the Biz Ops GraphQL API using a `GET` request. You should use this if data does not need to be up-to-date. Resolves to the data returned. If the server responds with a http error then this method rejects with the equivalent error provided by the [http-errors library](https://www.npmjs.com/package/http-errors#list-of-all-constructors). When "strict mode" is enabled the promise will also be rejected with a [`GraphQLError`](#errors) if a successful response includes any errors.

#### `graphQL.post(query: string, variables?: object, strict?: boolean)`

Fetches data from the Biz Ops GraphQL API using a `POST` request. You should use this if data must always be up-to-date. Resolves to the data returned. If the server responds with a http error then this method rejects with the equivalent error provided by the [http-errors library](https://www.npmjs.com/package/http-errors#list-of-all-constructors). When "strict mode" is enabled the promise will also be rejected with a [`GraphQLError`](#errors) if a successful response includes any errors.

> Note that GraphQL error handling may not align with your expectations if you're used to working with REST. Our server complies with the draft GraphQL over Http spec, and [here you can see examples of types of errors and responses](https://github.com/graphql/graphql-over-http/blob/main/spec/GraphQLOverHTTP.md#examples)

#### `node.head(type: string, code: string)`

Verifies if a record exists. Resolves to `true` if the request is successful. Rejects with a [`NotFound`](#errors) error if the requested record cannot be found.

#### `node.post(type: string, code: string, body: object, params?: object)`

Creates a new record. Resolves with the updated record if the request is successful. Rejects with a [`BadRequest`](#errors) error if the data does not match the [schema].

This method also accepts additional URL parameters to be set:

-   `upsert` a boolean which allows the creation of any new nodes needed to create relationships.
-   `lockFields` a list of fields to prevent any other system writing these fields, see [field locking] for more information.
-   `unlockFields` a list of fields to enable any system to write these fields, see [field locking] for more information.

#### `node.patch(type: string, code: string, body: object, params?: object)`

Updates an existing record (or creates if it doesn't already exist). Resolves with the updated record if the request is successful. Rejects with a [`BadRequest`](#errors) error if the data does not match the [schema].

This method also accepts additional URL parameters to be set:

-   `upsert` a boolean which allows the creation of any new nodes needed to create relationships.
-   `lockFields` a list of fields to prevent any other system writing these fields, see [field locking] for more information.
-   `unlockFields` a list of fields to enable any system to write these fields, see [field locking] for more information.
-   `relationshipAction` either `"merge"` or `"replace"` which specifies the behaviour when modifying relationships.

#### `node.delete(type: string, code: string, params?: object)`

Deletes an existing record. Resolves to `true` if the request is successful. Rejects with a [`NotFound`](#errors) error if the requested record cannot be found or a [`Conflict`](#errors) error if the record cannot be deleted.

This method also accepts additional URL parameters to be set:

-   `force` a boolean which allows the deletion of a node even if it has relationships

[schema]: https://github.com/Financial-Times/biz-ops-schema/tree/master/schema
[field locking]: https://github.com/Financial-Times/biz-ops-api/blob/master/ENDPOINTS.md#field-locking

#### `nodeAbsorb.post(type: string, targetCode: string, sourceCode: string)`

Merges two records by copying properties from the source node to the target node and deletes the original source node when complete. Resolves with the updated target record if the request is successful. Rejects with a [`NotFound`](#errors) error if either of the requested records cannot be found.

#### `batch.patch(type: string, body: object[], params?: object)`

Creates or modifies a batch of records of a given record type.

-   Requires its payload(records) to be sent as a JSON array
-   Resolves with a success message and total number of records created or modified.
-   Rejects with a [`HTTPError`](#errors) error if there is any payload validation error(s).

This method also accepts additional URL parameter to be set:

- `dryRun` a boolean (defaults to `false`) which when enabled allows you to validate the request and the batch payload without performing the actual creation or modification of records.

#### `batch.delete(type: string, codes: object[], params?: object)`

Deletes a batch of records of a given record type.

-   Requires its payload(valid Biz ops codes) to be sent as a JSON array
-   Resolves with a success message and total number of records deleted.
-   Rejects with a [`HTTPError`](#errors) error if there is any payload validation error(s).

This method also accepts additional URL parameter to be set:

- `dryRun` a boolean (defaults to `false`) which when enabled allows you to validate the request and the batch payload without performing the actual deletion of records.

#### `child(options?: object)`

Sometimes you may need multiple instances of the client. You can do that by calling `new Client()` multiple times but you will lose the benefits of using one single client, such as the long lived connections and rate limiting. This method returns a new client instance that shares these internals with the parent client. You can override the parent client options by providing additional [options](#options).

## Errors

### `HTTPError`

All non-20x responses will throw a corresponding error created by the [`http-errors`](https://www.npmjs.com/package/http-errors) package. This includes `BadRequest`, `NotFound`, and `InternalServerError` errors. If the API returns a detailed error then this will be used as the error message. The raw response may be appended to the error as the `details` property for further inspection.

### `ConfigurationError`

Will be thrown when initialising the `BizOpsClient` class with incomplete configuration or when calling methods with incorrect arguments.

### `GraphQLError`

Thrown when responses from the GraphQL API include any [errors](https://github.com/graphql/graphql-spec/blob/master/spec/Section%207%20--%20Response.md#errors). This includes a `details` property which can be inspected to find out more.

## Examples

### Catching and logging errors

This example demonstrates how to catch and log an error when a GraphQL query fails. Note that this example uses `return await` to ensure that exceptions are caught by the `catch` block defined in the function below.

```js
const { BizOpsClient } = require('@financial-times/biz-ops-client');

const client = new BizOpsClient({
	systemCode: 'my-service-name',
	apiKey: process.env.BIZ_OPS_API_KEY,
	host: process.env.BIZ_OPS_API_URL,
});

async function bizOpsQuery(query) {
	try {
		return await client.graphQL.post(query);
	} catch (error) {
		console.error(error, {
			event: 'BIZ_OPS_QUERY_FAILED',
		});

		return Promise.reject(error);
	}
}

module.exports = { bizOpsQuery };
```

### Creating a child client

This example demonstrates how to create a child client for each of your application users. It shows how to override the parent client's options to associated a username with requests.

```js
const { BizOpsClient } = require('./');

const client = new BizOpsClient({
	systemCode: 'my-service-name',
	apiKey: process.env.BIZ_OPS_API_KEY,
	host: process.env.BIZ_OPS_API_URL,
});

async function appRoute(request, response, next) {
	const child = client.child({
		userId: request.locals.username,
	});

	try {
		const data = await child.node.get(
			request.params.type,
			request.params.code,
		);

		response.json(data);
	} catch (error) {
		response.status(error.code || 500);
		next(error);
	}
}
```
