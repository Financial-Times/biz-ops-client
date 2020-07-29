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
 * Extract error message from GraphQL response data
 * @param {GraphQLResponse} result
 */
function extractError(result) {
	let message;

	try {
		message = result.errors[0].message;
	} catch (e) {
		const errors = JSON.stringify(result.errors);
		message = `GraphQL API responded with an error: ${errors}`;
	}

	return message;
}

/**
 * Handle GraphQL response data
 * @param {GraphQLResponse} result
 */
function handleResult(result) {
	if (result.data && !result.errors) {
		return result.data;
	}

	if (result.errors) {
		throw new Error(extractError(result));
	}

	throw new TypeError('Unexpected GraphQL response format');
}

module.exports = { extractError, handleResult };
