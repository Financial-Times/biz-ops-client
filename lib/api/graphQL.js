const { graphqlLodash } = require('graphql-lodash');
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
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildGraphQL(options) {
	const { makeRequest } = options;

	/**
	 * Make a GraphQL API GET request
	 * @param {String} query
	 * @param {Object} [variables={}]
	 * @param {Boolean} [strict=false]
	 * @returns {Promise<any>}
	 */
	async function get(rawquery, variables = {}, strict = false) {
		console.log("@@@@@@@@@@@@@@@@@@@ QUERY GET @@@@@@@@@@@@@@@@@@@@@@")
		console.log(rawquery)
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
		const qs = queryString({
			query:rawquery,
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
	 * @returns {Promise<any>}
	 */
	async function post(rawquery, variables = {}, strict = false) {
		console.log("@@@@@@@@@@@@@@@@@@@ QUERY POST @@@@@@@@@@@@@@@@@@@@@@")
		console.log(rawquery)
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

		// lodash integration part one - preparing the query
		const { query, transform } = graphqlLodash(rawquery);
		console.log(transform)

		const body = JSON.stringify({
			query,
			variables,
		});

		/** @type {GraphQLResponse} */
		const result = await makeRequest('/graphql', { method: 'POST', body });

		// lodash integration part two - transform the result
		result.data = transform(result.data);

		return strict ? throwOnErrors(result) : result.data;
	}

	return { get, post };
}

module.exports = buildGraphQL;
