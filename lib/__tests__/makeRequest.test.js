const nock = require('nock');
const subject = require('../makeRequest');

const ENDPOINT = 'https://www.example.com';

describe('lib/makeRequest', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	describe('when the request succeeds', () => {
		it('fetches and parses JSON data', async () => {
			nock(ENDPOINT).post('/').reply(200, { Hello: 'World' });

			const result = await subject(ENDPOINT);

			expect(result).toEqual({ Hello: 'World' });
		});
	});

	describe('when the request fails', () => {
		describe('because of a non-200 response', () => {
			it('throws an HTTP error', async () => {
				nock(ENDPOINT).post('/').reply(400, 'Oh dear!');

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError(
					expect.objectContaining({
						message: 'Bad Request',
						status: 400,
					}),
				);
			});
		});
	});
});