/* eslint max-classes-per-file:0 */
class NotImplementedError extends Error {
	constructor(message) {
		super(message || 'Requested method has not been implemented.');
	}
}

class ConfigurationError extends Error {
	constructor(message) {
		super(message || 'Required parameter has not been set');
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

		this.details = result.errors;
	}
}

module.exports = { NotImplementedError, ConfigurationError, GraphQLError };
