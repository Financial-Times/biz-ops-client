/**
 * Array chunk
 * @description Split an array into chunks of the specified size.
 * @param {any[]} arr
 * @param {number} [size=1000]
 * @returns {[any[]]}
 */
function arrayChunk(arr, size = 1000) {
	const results = [];

	let i = 0;

	while (i < arr.length) {
		results.push(arr.slice(i, size));
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
 * @typedef {() => Promise<{ numberOfRecords: number }>} BatchRequest
 */

/**
 * Handle Batch Requests
 * @param {BatchRequest[]} batches
 * @returns {Promise<{ successes: number, failures: number, actions: number }>}
 */
async function processBatchRequests(batches) {
	let fulfilled = 0;
	let rejected = 0;
	let records = 0;

	for (const batch of batches) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const response = await batch();
			fulfilled += 1;
			records += response.numberOfRecords;
		} catch {
			rejected += 1;
		}
	}

	return { fulfilled, rejected, records };
}

module.exports = {
	arrayChunk,
	compareRecordsByCode,
	processBatchRequests,
};

/**
Example usage:

const [rawData, bizOpsData] = await Promise.all([
    getAllDataFromSource(),
    getAllRecordsFromBizOps(),
]);

console.log(`Fetched ${rawData.length} data items from Y`);
console.log(`Fetched ${bizOpsData.length} records from Biz Ops`);

const normalisedData = normaliseTheData(rawData);
const actions = compareRecordsByCode(normalisedData, bizOpsData);

console.log(`Found ${actions.creates} records to be created`);
console.log(`Found ${actions.updates} records to be updated`);
console.log(`Found ${actions.deletes} records to be deleted`);

const patchBatches = arrayChunk([...actions.creates, ...actions.deletes]);
const deleteBatches = arrayChunk(actions.deletes);

const batchUpdateRequests = patchBatches.map(batch => () => sdk.batch.patch('Type', batch));
const batchDeleteRequests = deleteBatches.map(batch => () => sdk.batch.delete('Type', batch));

const updateResults = await processBatchRequests(batchUpdateRequests);
const deleteResults = await processBatchRequests(batchDeleteRequests);

console.log(`Updated ${updateResults.records} records in ${updateResults.fulfilled} successful batches`);
console.warn(`${actions.creates + actions.updates - updateResults.records} updates failed`);
console.log(`Deleted ${deleteResults.records} records in ${deleteResults.fulfilled} successful batches`);
console.warn(`${actions.deletes - deleteResults.records} deletes failed`);
*/
