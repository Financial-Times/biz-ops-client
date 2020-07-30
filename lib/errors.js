/* eslint max-classes-per-file:0 */
class ConfigurationError extends Error {
	constructor(message) {
		super(message || 'Required parameter has not been set');
		this.name = 'ConfigurationError';
	}
}

class GraphQLError extends Error {
	constructor(result) {
		let message;

		try {
			message = result.errors[0].message;
		} catch (e) {
			message = 'GraphQL API responded with an error';
		}

		super(message);

		this.name = 'GraphQLError';
		this.details = result;
	}
}

module.exports = { ConfigurationError, GraphQLError };
