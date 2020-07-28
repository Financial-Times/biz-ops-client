const nock = require('nock');
const subject = require('../makeRequest');

const ENDPOINT = 'https://www.example.com';

describe('lib/makeRequest', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	describe('when the request succeeds', () => {
		it('fetches and parses JSON data', async () => {
			nock(ENDPOINT)
				.post('/')
				.reply(200, { data: { Hello: 'World' } });

			const result = await subject(ENDPOINT);

			expect(result).toEqual({ Hello: 'World' });
		});
	});

	describe('when the request fails', () => {
		describe('because of a non-200 response', () => {
			it('throws indicating the HTTP error code', async () => {
				nock(ENDPOINT).post('/').reply(500, 'Oh dear!');

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError(
					expect.objectContaining({ status: 500 }),
				);
			});
		});

		describe('because of a non-JSON response', () => {
			it('throws indicating unexpected response structure', async () => {
				nock(ENDPOINT).post('/').reply(200, 'This is not JSON');

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError('This is not JSON');
			});
		});

		describe('because of an empty response with an error', () => {
			it('throws with the error message', async () => {
				nock(ENDPOINT)
					.post('/')
					.reply(200, {
						data: null,
						errors: [{ message: 'Rubbish!' }],
					});

				// eslint-disable-next-line unicorn/consistent-function-scoping
				const run = () => subject(ENDPOINT);

				await expect(run).rejects.toThrowError('Rubbish!');
			});
		});
	});
});
