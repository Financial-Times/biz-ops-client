const subject = require('../errors');

describe('lib/errors', () => {
	describe('GraphQLError', () => {
		const GRAPHQL_ERROR = {
			message: 'Something bad happened',
			locations: [],
			path: [],
		};

		it('abstracts the first GraphQL error message if available', () => {
			const { message } = new subject.GraphQLError({
				errors: [GRAPHQL_ERROR],
			});

			expect(message).toEqual('Something bad happened');
		});

		it('falls back to the status code if no error messages can be found', () => {
			const { message } = new subject.GraphQLError({
				errors: [],
			});

			expect(message).toEqual('GraphQL API responded with an error');
		});

		it('appends the error details', () => {
			const { details } = new subject.GraphQLError({
				errors: [GRAPHQL_ERROR],
			});

			expect(details).toEqual([GRAPHQL_ERROR]);
		});
	});
});
