const nock = require('nock');
const subject = require('../makeRequest');

const ENDPOINT = 'https://www.example.com';

describe('lib/makeRequest', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	describe('when the request succeeds', () => {
		it('fetches and parses JSON data', async () => {
			nock(ENDPOINT).get('/').reply(200, { Hello: 'World' });

			const result = await subject(ENDPOINT);

			expect(result).toEqual({ Hello: 'World' });
		});

		it('fetches and parses text data', async () => {
			nock(ENDPOINT).get('/').reply(200, 'Hello World');

			const result = await subject(ENDPOINT);

			expect(result).toEqual('Hello World');
		});
	});

	describe('when the request fails', () => {
		describe('because of a non-200 response', () => {
			it('throws an HTTP error', async () => {
				nock(ENDPOINT).get('/').reply(400, 'Oh dear!');

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError(
					expect.objectContaining({ name: 'BadRequestError' }),
				);
			});

			it('includes error messages if available', async () => {
				const validationError = {
					errors: [
						{
							message: 'Invalid property `foo` on type `Bar`.',
						},
					],
				};

				nock(ENDPOINT).get('/').reply(400, validationError);

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError(
					expect.objectContaining({
						name: 'BadRequestError',
						message: 'Invalid property `foo` on type `Bar`.',
					}),
				);
			});

			it('includes the original response as details', async () => {
				nock(ENDPOINT).get('/').reply(400, 'You cannot do that!');

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError(
					expect.objectContaining({
						details: 'You cannot do that!',
					}),
				);
			});
		});
	});
});
