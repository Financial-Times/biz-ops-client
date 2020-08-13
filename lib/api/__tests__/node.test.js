const subject = require('../node');

describe('lib/api/node', () => {
	const makeRequestMock = jest.fn();
	const api = subject({ makeRequest: makeRequestMock });

	afterEach(() => {
		makeRequestMock.mockReset();
	});

	describe('.head()', () => {
		it('makes a HEAD request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.head('Type', 'Code');

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code',
				expect.objectContaining({ method: 'HEAD' }),
			);
		});

		it('resolves with a boolean when successful', async () => {
			makeRequestMock.mockResolvedValue({});

			const result = await api.head('Type', 'Code');

			expect(result).toEqual(true);
		});
	});

	describe('.post()', () => {
		it('appends a body to the request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.post('Type', 'Code', { Hello: 'World' });

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code',
				expect.objectContaining({
					method: 'POST',
					body: '{"Hello":"World"}',
				}),
			);
		});

		it('appends a params as a query string', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.post('Type', 'Code', {}, { lockFields: 'field-name' });

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code?lockFields=field-name',
				expect.any(Object),
			);
		});

		it('resolves with the response data', async () => {
			makeRequestMock.mockResolvedValue({
				Hello: 'World',
			});

			const result = await api.post('Type', 'Code', {});

			expect(result).toEqual({ Hello: 'World' });
		});
	});

	describe('.patch()', () => {
		it('appends a body to the request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.patch('Type', 'Code', { Hello: 'World' });

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code',
				expect.objectContaining({
					method: 'PATCH',
					body: '{"Hello":"World"}',
				}),
			);
		});

		it('appends a params as a query string', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.post('Type', 'Code', {}, { lockFields: 'field-name' });

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code?lockFields=field-name',
				expect.any(Object),
			);
		});

		it('resolves with the response data', async () => {
			makeRequestMock.mockResolvedValue({
				Hello: 'World',
			});

			const result = await api.patch('Type', 'Code', {});

			expect(result).toEqual({ Hello: 'World' });
		});
	});

	describe('.delete()', () => {
		it('makes a DELETE request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.delete('Type', 'Code');

			expect(makeRequestMock).toHaveBeenCalledWith(
				'/v2/node/Type/Code',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('resolves with a boolean when successful', async () => {
			makeRequestMock.mockResolvedValue({});

			const result = await api.delete('Type', 'Code');

			expect(result).toEqual(true);
		});
	});
});
