const subject = require('../utils');

describe('lib/api/utils', () => {
	const batchPatchMock = jest.fn();
	const batchDeleteMock = jest.fn();
	const api = subject({
		batch: { patch: batchPatchMock, delete: batchDeleteMock },
	});

	afterEach(() => {
		batchPatchMock.mockReset();
		batchDeleteMock.mockReset();
	});

	describe('.batchPatch()', () => {
		it('calls the process batch patch function', async () => {
			await api.batchPatch('TypeName', [{ code: 'abc' }]);

			expect(batchPatchMock).toHaveBeenCalledWith('TypeName', [
				{ code: 'abc' },
			]);
		});

		it('returns a batch result object', async () => {
			const result = await api.batchPatch('TypeName', [{ code: 'abc' }]);

			expect(result).toEqual(
				expect.objectContaining({
					successfulBatchCount: expect.any(Number),
					failedBatchCount: expect.any(Number),
					successfulRecordCount: expect.any(Number),
					failedRecordCount: expect.any(Number),
				}),
			);
		});
	});

	describe('.batchDelete()', () => {
		it('calls the process batch delete function', async () => {
			await api.batchDelete('TypeName', [{ code: 'abc' }]);

			expect(batchDeleteMock).toHaveBeenCalledWith('TypeName', [
				{ code: 'abc' },
			]);
		});

		it('returns a batch result object', async () => {
			const result = await api.batchPatch('TypeName', [{ code: 'abc' }]);

			expect(result).toEqual(
				expect.objectContaining({
					successfulBatchCount: expect.any(Number),
					failedBatchCount: expect.any(Number),
					successfulRecordCount: expect.any(Number),
					failedRecordCount: expect.any(Number),
				}),
			);
		});
	});
});
