const subject = require('../graphQL');

describe('lib/graphQL', () => {
	describe('.extractError()', () => {
		const GRAPHQL_ERROR = {
			message: 'Something bad happened',
			locations: [],
			path: [],
		};

		it('abstracts the first GraphQL error message if available', () => {
			const result = subject.extractError({
				errors: [GRAPHQL_ERROR],
			});

			expect(result).toEqual('Something bad happened');
		});

		it('falls back to the status code if no error messages can be found', () => {
			const result = subject.extractError({
				errors: [],
			});

			expect(result).toEqual('GraphQL API responded with an error: []');
		});
	});

	describe('.handleResult()', () => {
		describe('when the response data is valid', () => {
			it('returns the response data', () => {
				const result = subject.handleResult({
					data: { Hello: 'World' },
				});

				expect(result).toEqual({ Hello: 'World' });
			});
		});

		describe('when the response data is invalid', () => {
			describe('because of a non-JSON response', () => {
				it('throws indicating unexpected response type', async () => {
					// eslint-disable-next-line unicorn/consistent-function-scoping
					const run = () => subject.handleResult('This is not JSON');

					await expect(run).toThrowError(
						'Unexpected GraphQL response format',
					);
				});
			});

			describe('because the response data includes an error', () => {
				it('throws with the error message', async () => {
					// eslint-disable-next-line unicorn/consistent-function-scoping
					const run = () => {
						return subject.handleResult({
							data: null,
							errors: [{ message: 'Rubbish!' }],
						});
					};

					await expect(run).toThrowError('Rubbish!');
				});
			});
		});
	});
});
