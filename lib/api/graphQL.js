const { stringify } = require('querystring');
const urlJoin = require('url-join');
const graphQL = require('../graphQL');
const makeRequest = require('../makeRequest');

// Removes extraneous horizontal whitespace but preserves newlines
const formatQueryParam = query => query.replace(/[ \t]+/g, ' ').trim();

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

	return graphQL.handleResult(result);
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

	return graphQL.handleResult(result);
}

module.exports = { get, post };
