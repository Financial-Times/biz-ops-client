/**
 * @typedef {import('../BizOpsClient')} BizOpsClient
 */

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
 * Compare Records by Code
 * @description Compares two arrays of objects with a code parameter.
 * @param {Record[]} recordsA
 * @param {Record[]} recordsB
 * @returns {{ creates: Record[], updates: Record[], deletes: Record[] }}
 */
function compareRecordsByCode(recordsA, recordsB) {
	const codesA = new Set(recordsA.map(record => record.code));
	const codesB = new Set(recordsB.map(record => record.code));

	const creates = [];
	const updates = [];
	const deletes = [];

	recordsA.forEach(record => {
		if (codesB.has(record.code)) {
			updates.push(record);
		} else {
			creates.push(record);
		}
	});

	recordsB.forEach(record => {
		if (!codesA.has(record.code)) {
			deletes.push(record);
		}
	});

	return { creates, updates, deletes };
}

/**
 * @typedef {{ numberOfRecords: number }} BizOpsResponse
 */

/**
 * @typedef {{ message: string, details: string }} BizOpsError
 */

/**
 * @typedef {object} BatchResult
 * @property {number} batchesFulfilled
 * @property {number} batchesRejected
 * @property {number} recordsFulfilled
 * @property {number} recordsRejected
 * @property {BizOpsError[]} errors
 */

/**
 * Process Batch Requests
 * @description Performs a set of batch requests and records the results
 * @param {string} recordType
 * @param {Record[]} records
 * @param {() => Promise<BizOpsResponse>} records
 * @returns {Promise<BatchResult>}
 */
async function processBatchRequests(recordType, batches, batchFn) {
	const errors = [];

	let batchesFulfilled = 0;
	let batchesRejected = 0;
	let recordsFulfilled = 0;
	let recordsRejected = 0;

	for (const batch of batches) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await batchFn(recordType, batch);
			batchesFulfilled++;
			recordsFulfilled += batch.length;
		} catch (error) {
			batchesRejected++;
			recordsRejected += batch.length;

			if (Array.isArray(error.details?.errors)) {
				errors.push(...error.details.errors);
			}
		}
	}

	return {
		batchesFulfilled,
		batchesRejected,
		recordsFulfilled,
		recordsRejected,
		errors,
	};
}

/**
 * Batch patch
 * @description Create batch PATCH requests for the given list of records
 * @param {BizOpsClient} client
 * @param {string} recordType
 * @param {Record[]} records
 * @returns {BatchResult & { duration: number }}
 */
async function batchPatch(client, recordType, records) {
	const start = Date.now();
	const batches = arrayChunk(records);
	const result = await processBatchRequests(
		recordType,
		batches,
		client.batch.patch.bind(client),
	);
	const duration = Date.now() - start;

	return { ...result, duration };
}

/**
 * Batch delete
 * @description Create batch PATCH requests for the given list of records
 * @param {BizOpsClient} client
 * @param {string} recordType
 * @param {Record[]} records
 * @returns {BatchResult & { duration: number }}
 */
async function batchDelete(client, recordType, records) {
	const start = Date.now();
	const batches = arrayChunk(records);
	const result = await processBatchRequests(
		recordType,
		batches,
		client.batch.delete.bind(client),
	);
	const duration = Date.now() - start;

	return { ...result, duration };
}

module.exports = {
	arrayChunk,
	compareRecordsByCode,
	processBatchRequests,
	batchPatch,
	batchDelete,
};

/**
Example usage:

const [rawData, bizOpsRecords] = await Promise.all([
	getDataFromSource(),
	getRecordsFromBizOps(),
]);

console.log(`Fetched ${rawData.length} data items from Y`);
console.log(`Fetched ${bizOpsRecords.length} records from Biz Ops`);

const normalisedRecords = normaliseTheData(rawData);
const actions = compareRecordsByCode(normalisedRecords, bizOpsRecords);

console.log(`Found ${actions.creates} records to be created`);
console.log(`Found ${actions.updates} records to be updated`);
console.log(`Found ${actions.deletes} records to be deleted`);

const patchResult = batchPatch(client, 'Type', [...actions.creates, ...actions.updates]);
console.log(`Updated ${patchResult.recordsFulfilled} records in ${patchResult.batchesFulfilled} successful batches`);
console.warn(`Failed to update ${patchResult.recordsRejected} records in ${patchResult.batchesRejected} batches`);

const deleteResult = batchDelete(client, 'Type', actions.deletes);
console.log(`Deleted ${deleteResult.recordsFulfilled} records in ${deleteResult.batchesFulfilled} successful batches`);
console.warn(`Failed to delete ${deleteResult.recordsRejected} records in ${deleteResult.batchesRejected} batches`);
*/
