jest.mock('../makeRequest', () => {
	// We must mock the implementation as the p-ratelimit library
	// expects callbacks to return a promise.
	return jest.fn().mockResolvedValue(null);
});

const subject = require('../createTransport');
const makeRequest = require('../makeRequest');

const OPTIONS = {
	apiKey: 'xxxx-xxxx-xxxx',
	systemCode: 'my-fab-app',
	host: 'https://example.com',
	timeout: 3000,
};

const INTERNAL_OPTIONS = {
	agent: null,
	queue: callback => callback(),
};

describe('lib/createTransport', () => {
	it('joins the given path to the configured host', async () => {
		const result = subject(OPTIONS, INTERNAL_OPTIONS);

		await result('/path?foo=bar');

		expect(makeRequest).toHaveBeenCalledWith(
			'https://example.com/path?foo=bar',
			expect.any(Object),
		);
	});

	it('sets default request initialisation options', async () => {
		const result = subject(OPTIONS, INTERNAL_OPTIONS);

		await result('/path');

		expect(makeRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				method: expect.any(String),
				timeout: expect.any(Number),
			}),
		);
	});

	it('sets default request headers', async () => {
		const result = subject(OPTIONS, INTERNAL_OPTIONS);

		await result('/path');

		expect(makeRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					'content-type': 'application/json',
					'user-agent': expect.stringMatching(/biz-ops-client/),
				}),
			}),
		);
	});

	it('sets authentication request headers', async () => {
		const result = subject(OPTIONS, INTERNAL_OPTIONS);

		await result('/path');

		expect(makeRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					'x-api-key': 'xxxx-xxxx-xxxx',
					'client-id': 'my-fab-app',
				}),
			}),
		);
	});

	it('only sets defined authentication headers', async () => {
		const result = subject(OPTIONS, INTERNAL_OPTIONS);

		await result('/path');

		expect(makeRequest).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.not.objectContaining({
					'client-user-id': undefined,
				}),
			}),
		);
	});
});
