const subject = require('../graphQL');

describe('lib/api/graphQL', () => {
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