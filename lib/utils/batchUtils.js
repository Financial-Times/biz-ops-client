/**
 * Array chunk
 * @description Split an array into chunks of the specified size.
 * @param {any[]} arr
 * @param {number} [size=1000]
 * @returns {[any[]]} An array of arrays of specified size
 */
function arrayChunk(arr, size = 1000) {
	const results = [];

	let i = 0;

	while (i < arr.length) {
		results.push(arr.slice(i, i + size));
		i += size;
	}

	return results;
}

/**
 * @typedef {Object} Record
 * @property {string} code
 */

/**
 * @typedef {{ message: string, numberOfRecords: number }} BizOpsResponse
 */

/**
 * @typedef {{ message: string, details: { messages: string[] } }} BizOpsErrorDetail
 */

/**
 * @typedef {{ errors: Array<{ message: string, details: BizOpsErrorDetail[] }> }} BizOpsErrorResponse
 */

/**
 * @typedef {object} BatchResult
 * @property {number} successfulBatchCount
 * @property {number} failedBatchCount
 * @property {number} successfulRecordCount
 * @property {number} failedRecordCount
 * @property {Array<Error | BizOpsErrorDetail>} errors
 */

/**
 * Process Batches
 * @description Calls the batch function for each chunk of records and collects the results
 * @param {string} recordType
 * @param {Array<Record[]>} batches
 * @param {(records: Record[]) => Promise<BizOpsResponse>} batchFn
 * @returns {Promise<BatchResult>}
 */
async function processBatches(recordType, batches, batchFn) {
	const errors = [];

	let successfulBatchCount = 0;
	let failedBatchCount = 0;
	let successfulRecordCount = 0;
	let failedRecordCount = 0;

	for (const batch of batches) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await batchFn(recordType, batch);
			successfulBatchCount++;
			successfulRecordCount += batch.length;
		} catch (error) {
			failedBatchCount++;
			failedRecordCount += batch.length;

			if (Array.isArray(error.errors)) {
				errors.push(...error.errors);
			} else {
				errors.push(error);
			}
		}
	}

	return {
		successfulBatchCount,
		failedBatchCount,
		successfulRecordCount,
		failedRecordCount,
		errors,
	};
}

/**
 * Process records
 * @description Chunks a list of records, calls the batch function for each, and collects the results
 * @param {string} recordType
 * @param {Record[]} records
 * @param {(records: Record[]) => Promise<BizOpsResponse>} batchFn
 * @param {number} batchSize
 * @returns {Promise<BatchResult & { duration: number }>}
 */
async function processRecords(recordType, records, batchFn, batchSize = 1000) {
	const start = Date.now();
	const batches = arrayChunk(records, batchSize);
	const result = await processBatches(recordType, batches, batchFn);
	const duration = Date.now() - start;

	return { ...result, duration };
}

module.exports = {
	arrayChunk,
	processBatches,
	processRecords,
};