const Subject = require('../BizOpsClientError');

const GRAPHQL_ERROR = {
	message: 'Something bad happened',
	locations: [],
	path: '',
};

describe('lib/BizOpsClientError', () => {
	it('accepts the error message as a string', () => {
		const { message } = new Subject({
			errors: 'Something bad happened',
			status: 500,
		});

		expect(message).toEqual('Something bad happened');
	});

	it('abstracts the first GraphQL error message if available', () => {
		const { message } = new Subject({
			errors: [GRAPHQL_ERROR],
			status: 500,
		});

		expect(message).toEqual('Something bad happened');
	});

	it('falls back to the status code if no error messages can be found', () => {
		const { message } = new Subject({
			errors: [],
			status: 500,
		});

		expect(message).toEqual('GraphQL API responded with a 500');
	});
});
