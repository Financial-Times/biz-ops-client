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
 * Make a GraphQL API GET request
 * @param {import('../makeRequest')} makeRequest
 * @param {String} query
 * @param {Object} [variables={}]
 * @param {Boolean} [strict=false]
 */
async function get(makeRequest, query, variables = {}, strict = false) {
	const qs = stringify({
		query: formatQuery(query),
		variables: JSON.stringify(variables),
	});

	const result = await makeRequest(`/graphql?${qs}`, { method: 'GET' });

	return strict ? throwOnErrors(result) : result;
}

/**
 * Make a GraphQL API POST request
 * @param {import('../makeRequest')} makeRequest
 * @param {String} query
 * @param {Object} [variables={}]
 * @param {Boolean} [strict=false]
 */
async function post(makeRequest, query, variables = {}, strict = false) {
	const body = JSON.stringify({
		query,
		variables,
	});

	const result = await makeRequest('/graphql', { method: 'POST', body });

	return strict ? throwOnErrors(result) : result;
}

module.exports = { get, post };
