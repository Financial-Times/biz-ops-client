/* eslint max-classes-per-file:0 */
class ConfigurationError extends Error {
	constructor(message: string) {
		super(message || 'Required parameter has not been set');
		this.name = 'ConfigurationError';
	}
}

class GraphQLError extends Error {
	public details: any;

	constructor(result: any) {
		let message: string;

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

export { ConfigurationError, GraphQLError };
