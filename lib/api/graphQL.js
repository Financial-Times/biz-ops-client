const { stringify } = require('querystring');
const { GraphQLError } = require('../errors');

/**
 * @typedef GraphQLError
 * @property {String} message
 * @property {Array<Object>} [locations]
 * @property {Array<String>} [path]
 */

/**
 * @typedef GraphQLResponse
 * @property {any} [data]
 * @property {Array<GraphQLError>} [errors]
 */

/**
 * Removes extraneous whitespace from a GraphQL query
 * @param {String} query
 * @returns {String}
 */
function formatQuery(query) {
	return query.replace(/[ \t]+/g, ' ').trim();
}

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
 * @param {import('../createAPI').FactoryOptions} options
 */
function buildGraphQL(options) {
	const { makeRequest } = options;

	/**
	 * Make a GraphQL API GET request
	 * @param {String} query
	 * @param {Object} [variables={}]
	 * @param {Boolean} [strict=false]
	 */
	async function get(query, variables = {}, strict = false) {
		const qs = stringify({
			query: formatQuery(query),
			variables: JSON.stringify(variables),
		});

		/** @type {GraphQLResponse} */
		const result = await makeRequest(`/graphql?${qs}`, { method: 'GET' });

		return strict ? throwOnErrors(result) : result.data;
	}

	/**
	 * Make a GraphQL API POST request
	 * @param {String} query
	 * @param {Object} [variables={}]
	 * @param {Boolean} [strict=false]
	 */
	async function post(query, variables = {}, strict = false) {
		const body = JSON.stringify({
			query,
			variables,
		});

		/** @type {GraphQLResponse} */
		const result = await makeRequest('/graphql', { method: 'POST', body });

		return strict ? throwOnErrors(result) : result.data;
	}

	return { get, post };
}

module.exports = buildGraphQL;
