const subject = require('../batchUtils');

describe('lib/utils/batchUtils', () => {
	describe('.arrayChunk()', () => {
		it('returns a new array', () => {
			const input = [];
			const result = subject.arrayChunk(input);
			expect(result).not.toBe(input);
		});

		it('splits given array into separate arrays of specified size', () => {
			const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			const result = subject.arrayChunk(input, 3);
			expect(result).toEqual([
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			]);
		});
	});

	describe('.processBatches()', () => {
		it('calls the batch function for each batch', async () => {
			const input = [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			];
			const mockFn = jest.fn().mockResolvedValue({});

			await subject.processBatches('TypeName', input, mockFn);

			expect(mockFn).toHaveBeenNthCalledWith(1, 'TypeName', [1, 2, 3]);
			expect(mockFn).toHaveBeenNthCalledWith(2, 'TypeName', [4, 5, 6]);
			expect(mockFn).toHaveBeenNthCalledWith(3, 'TypeName', [7, 8, 9]);
		});

		it('counts the successful batches and records', async () => {
			const input = [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			];
			const mockFn = jest.fn().mockResolvedValue({});
			const result = await subject.processBatches(
				'TypeName',
				input,
				mockFn,
			);

			expect(result.successfulBatchCount).toBe(3);
			expect(result.successfulRecordCount).toBe(9);
			expect(result.failedBatchCount).toBe(0);
			expect(result.failedRecordCount).toBe(0);
		});

		it('counts the unsuccessful batches and records', async () => {
			const input = [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			];
			const mockFn = jest
				.fn()
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce({ errors: [{ message: 'Oh no!' }] })
				.mockResolvedValueOnce({});

			const result = await subject.processBatches(
				'TypeName',
				input,
				mockFn,
			);

			expect(result.successfulBatchCount).toBe(2);
			expect(result.successfulRecordCount).toBe(6);
			expect(result.failedBatchCount).toBe(1);
			expect(result.failedRecordCount).toBe(3);
		});

		it('collects API error responses', async () => {
			const input = [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			];
			const mockFn = jest
				.fn()
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce({ errors: [{ message: 'Oh no!' }] })
				.mockResolvedValueOnce({});

			const result = await subject.processBatches(
				'TypeName',
				input,
				mockFn,
			);

			expect(result.errors).toEqual([{ message: 'Oh no!' }]);
		});
	});

	describe('.processRecords()', () => {
		it('splits the list of records into batches of the specified size', async () => {
			const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			const mockFn = jest.fn().mockResolvedValue({});

			await subject.processRecords('TypeName', input, mockFn, 3);

			expect(mockFn).toHaveBeenCalledTimes(3);
		});

		it('appends a duration to the result', async () => {
			const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			const mockFn = jest.fn().mockResolvedValue({});
			const result = await subject.processRecords(
				'TypeName',
				input,
				mockFn,
				3,
			);

			expect(result).toEqual(
				expect.objectContaining({
					successfulBatchCount: 3,
					failedBatchCount: 0,
					successfulRecordCount: 9,
					failedRecordCount: 0,
					duration: expect.any(Number),
				}),
			);
		});
	});
});
