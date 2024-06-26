const urlJoin = require('url-join');
const { GraphQLError } = require('../errors');
const queryString = require('../utils/queryString');

/**
 * @typedef GraphQLError
 * @property {String} message
 * @property {Array<{ line: number; column: number }>} [locations]
 * @property {Array<String>} [path]
 */

/**
 * @typedef GraphQLResponse
 * @property {any} [data]
 * @property {Array<GraphQLError>} [errors]
 */

/**
 * Throws if the GraphQL response data includes any errors
 * @param {GraphQLResponse} result
 * @returns {GraphQLResponse}
 * @throws {GraphQLError|TypeError}
 */
function throwOnErrors(result) {
	if (result.data && !result.errors) {
		return result.data;
	}

	if (result.errors) {
		throw new GraphQLError(result);
	}

	throw new TypeError('Unexpected GraphQL response format');
}

/**
 * @param {string} baseUrl - the base url for graphql actions. Will default to '/graphql' if no `graphqlEndpoint` option is provided.
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildGraphQL(baseUrl, options) {
	const { makeRequest } = options;

	/**
	 * Make a GraphQL API GET request
	 * @param {String} query
	 * @param {Object} [variables={}]
	 * @param {Boolean} [strict=false]
	 * @returns {Promise<any>}
	 */
	async function get(query, variables = {}, strict = false) {
		const qs = queryString({
			query,
			variables: JSON.stringify(variables),
		});

		/** @type {GraphQLResponse} */
		const url = urlJoin(baseUrl, `?${qs}`);
		const result = await makeRequest(url, { method: 'GET' });

		if (!result.data) throwOnErrors(result);
		return strict ? throwOnErrors(result) : result.data;
	}

	/**
	 * Make a GraphQL API POST request
	 * @param {String} query
	 * @param {Object} [variables={}]
	 * @param {Boolean} [strict=false]
	 * @returns {Promise<any>}
	 */
	async function post(query, variables = {}, strict = false) {
		const body = JSON.stringify({
			query,
			variables,
		});

		/** @type {GraphQLResponse} */
		const result = await makeRequest(baseUrl, { method: 'POST', body });

		if (!result.data) throwOnErrors(result);
		return strict ? throwOnErrors(result) : result.data;
	}

	return { get, post };
}

module.exports = buildGraphQL;
