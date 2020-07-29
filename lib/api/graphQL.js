const { stringify } = require('querystring');
const urlJoin = require('url-join');
const makeRequest = require('../makeRequest');
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
 * @param {import('../BizOpsClient').Options} options
 * @param {String} query
 * @param {Object} [variables={}]
 */
async function get(options, query, variables = {}) {
	const qs = stringify({
		query: formatQueryParam(query),
		variables: JSON.stringify(variables),
	});

	const url = urlJoin(options.host, '/graphql', `?${qs}`);

	const result = await makeRequest(
		url,
		{ method: 'GET' },
		{
			'Client-ID': options.systemCode,
			'X-Api-Key': options.apiKey,
		},
	);

	return handleResult(result);
}

/**
 * Make a GraphQL API POST request
 * @param {import('../BizOpsClient').Options} options
 * @param {String} query
 * @param {Object} [variables={}]
 */
async function post(options, query, variables = {}) {
	const url = urlJoin(options.host, '/graphql');

	const body = JSON.stringify({
		query,
		variables,
	});

	const result = await makeRequest(
		url,
		{ method: 'POST', body },
		{
			'Client-ID': options.systemCode,
			'X-Api-Key': options.apiKey,
		},
	);

	return handleResult(result);
}

module.exports = { handleResult, get, post };
