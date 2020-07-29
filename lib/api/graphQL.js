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
 * Format GraphQL query string parameter
 * @param {String} query
 * @returns {String}
 */
function formatQueryParam(query) {
	// Remove extraneous whitespace to shorten URL
	return query.replace(/[ \t]+/g, ' ').trim();
}

/**
 * Handle GraphQL response data
 * @param {GraphQLResponse} result
 * @returns {GraphQLResponse}
 * @throws {GraphQLError|TypeError}
 */
function handleResult(result) {
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
 */
async function get(makeRequest, query, variables = {}) {
	const qs = stringify({
		query: formatQueryParam(query),
		variables: JSON.stringify(variables),
	});

	const result = await makeRequest(`/graphql?${qs}`, { method: 'GET' });

	return handleResult(result);
}

/**
 * Make a GraphQL API POST request
 * @param {import('../makeRequest')} makeRequest
 * @param {String} query
 * @param {Object} [variables={}]
 */
async function post(makeRequest, query, variables = {}) {
	const body = JSON.stringify({
		query,
		variables,
	});

	const result = await makeRequest('/graphql', { method: 'POST', body });

	return handleResult(result);
}

module.exports = { handleResult, get, post };
