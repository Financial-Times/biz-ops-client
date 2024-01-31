const subject = require('../graphQL');

describe('lib/api/graphQL', () => {
	const makeRequestMock = jest.fn();
	const api = subject({ makeRequest: makeRequestMock });

	afterEach(() => {
		makeRequestMock.mockReset();
	});

	describe('.get()', () => {
		it('appends a query string to the request', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
			});

			await api.get('{ query }');

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/graphql?query=%7B+query+%7D&variables=%7B%7D',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('resolves with the response data', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
			});

			const result = await api.get('{ query }');

			expect(result).toEqual({ Hello: 'World' });
		});

		it('will ignore errors in the response by default', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
				errors: [{ message: 'Oh, mate' }],
			});

			const result = await api.get('{ query }');

			expect(result).toEqual({ Hello: 'World' });
		});

		it('rejects when strict mode is enabled', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
				errors: [{ message: 'Oh, mate' }],
			});

			// eslint-disable-next-line unicorn/consistent-function-scoping
			const run = () => api.get('{ query }', null, true);

			await expect(run).rejects.toThrowError(
				expect.objectContaining({ name: 'GraphQLError' }),
			);
		});

		it('rejects when returned data is undefined and strict is true', async () => {
			makeRequestMock.mockResolvedValue({
				data: undefined,
				errors: [{ message: 'Oh, mate' }],
			});

			// eslint-disable-next-line unicorn/consistent-function-scoping
			const run = () => api.get('{ query }', null, true);

			await expect(run).rejects.toThrowError(
				expect.objectContaining({ name: 'GraphQLError' }),
			);
		});

		it('still rejects when returned data is undefined if strict is false', async () => {
			makeRequestMock.mockResolvedValue({
				data: undefined,
				errors: [{ message: 'Oh, mate' }],
			});

			// eslint-disable-next-line unicorn/consistent-function-scoping
			const run = () => api.get('{ query }', null);

			await expect(run).rejects.toThrowError(
				expect.objectContaining({ name: 'GraphQLError' }),
			);
		});

		it('doesnt reject when returned data is empty', async () => {
			makeRequestMock.mockResolvedValue({
				data: [],
				errors: [{ message: 'no  problem here!' }],
			});

			// eslint-disable-next-line unicorn/consistent-function-scoping
			const result = await api.get('{ query }', null);

			expect(result).toEqual([]);
		});
	});

	describe('.post()', () => {
		it('appends a body to the request', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
			});

			await api.post('{ query }');

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/graphql',
				expect.objectContaining({
					method: 'POST',
					body: '{"query":"{ query }","variables":{}}',
				}),
			);
		});

		it('resolves with the response data', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
			});

			const result = await api.post('{ query }');

			expect(result).toEqual({ Hello: 'World' });
		});

		it('will ignore errors in the response by default', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
				errors: [{ message: 'Oh, mate' }],
			});

			const result = await api.post('{ query }');

			expect(result).toEqual({ Hello: 'World' });
		});

		it('rejects when strict mode is enabled', async () => {
			makeRequestMock.mockResolvedValue({
				data: { Hello: 'World' },
				errors: [{ message: 'Oh, mate' }],
			});

			// eslint-disable-next-line unicorn/consistent-function-scoping
			const run = () => api.post('{ query }', null, true);

			await expect(run).rejects.toThrowError(
				expect.objectContaining({ name: 'GraphQLError' }),
			);
		});
	});
});
