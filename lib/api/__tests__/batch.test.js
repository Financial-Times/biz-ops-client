const urlJoin = require('url-join');

const subject = require('../batch');

const patchPayload = [
	{
		code: 'code-1',
		name: 'name-1',
	},
	{
		code: 'code-2',
		name: 'name-2',
	},
	{
		code: 'code-3',
		name: 'name-3',
	},
];
const deletePayload = ['code-1', 'code-2', 'code-3'];
const baseUrl = '/v1/batch';

describe('lib/api/batch', () => {
	const makeRequestMock = jest.fn();
	const api = subject(baseUrl, { makeRequest: makeRequestMock });

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('.patch()', () => {
		it('should make a batch PATCH request', async () => {
			const recordType = 'Type';
			const params = { dryRun: true };

			const expectedUrl = urlJoin(baseUrl, recordType, `?dryRun=true`);
			const expectedRequestBody = JSON.stringify(patchPayload);

			await api.patch(recordType, patchPayload, params);

			expect(makeRequestMock).toHaveBeenCalledWith(expectedUrl, {
				method: 'PATCH',
				body: expectedRequestBody,
			});
		});

		it('appends a body to the request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.patch('Type', patchPayload);

			expect(makeRequestMock).toHaveBeenCalledWith(
				`${baseUrl}/Type`,
				expect.objectContaining({
					method: 'PATCH',
					body: JSON.stringify(patchPayload),
				}),
			);
		});

		it('appends a dryRun param if passed as a query string', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.patch('Type', patchPayload, { dryRun: true });

			expect(makeRequestMock).toHaveBeenCalledWith(
				`${baseUrl}/Type?dryRun=true`,
				expect.any(Object),
			);
		});

		it('resolves with the response data', async () => {
			const expectedResponse = {
				message: 'Successfully created/updated all records',
				numberOfRecords: 3,
			};
			makeRequestMock.mockResolvedValue(expectedResponse);

			const response = await api.patch('Type', patchPayload);

			expect(response).toEqual(expectedResponse);
		});
	});

	describe('.delete()', () => {
		it('should make a batch DELETE request', async () => {
			const recordType = 'Type';
			const params = { dryRun: true };

			const expectedUrl = urlJoin(baseUrl, recordType, `?dryRun=true`);
			const expectedRequestBody = JSON.stringify(deletePayload);

			await api.delete(recordType, deletePayload, params);

			expect(makeRequestMock).toHaveBeenCalledWith(expectedUrl, {
				method: 'DELETE',
				body: expectedRequestBody,
			});
		});

		it('appends a body to the request', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.delete('Type', deletePayload);

			expect(makeRequestMock).toHaveBeenCalledWith(
				`${baseUrl}/Type`,
				expect.objectContaining({
					method: 'DELETE',
					body: JSON.stringify(deletePayload),
				}),
			);
		});

		it('appends a dryRun param if passed as a query string', async () => {
			makeRequestMock.mockResolvedValue({});

			await api.delete('Type', deletePayload, { dryRun: true });

			expect(makeRequestMock).toHaveBeenCalledWith(
				`${baseUrl}/Type?dryRun=true`,
				expect.any(Object),
			);
		});

		it('resolves with the response data', async () => {
			const expectedResponse = {
				message: 'Successfully deleted all records',
				numberOfRecords: 2,
			};
			makeRequestMock.mockResolvedValue(expectedResponse);

			const response = await api.delete('Type', deletePayload);

			expect(response).toEqual(expectedResponse);
		});
	});
});
