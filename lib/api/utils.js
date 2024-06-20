/**
 * @typedef {import('../BizOpsClient')} BizOpsClient
 */

/**
 * @typedef {import('../utils/batchUtils').Record} Record
 */

/**
 * @typedef {import('../utils/batchUtils').BatchResultWithDuration} Result
 */

const { processRecords } = require('../utils/batchUtils');

/**
 * @param {BizOpsClient} client - instance of the Biz Ops Client
 */
function buildUtils(client) {
	/**
	 * Batch patch utility
	 * @description Create batch PATCH requests for the given list of records
	 * @param {string} recordType - The type of Biz Ops record to patch
	 * @param {Record[]} records - An array of Biz Ops record data
  	 * @param {number} [batchSize=1000] - The number of records to send in each patch
	 * @returns {Promise<Result>} A batch process results object
	 */
	function batchPatch(recordType, records, batchSize = 1000) {
		return processRecords(recordType, records, client.batch.patch, batchSize);
	}

	/**
	 * Batch delete utility
	 * @description Create batch DELETE requests for the given list of records
	 * @param {string} recordType - The type of Biz Ops record to delete
	 * @param {string[]} codes - An array of Biz Ops record codes
  	 * @param {number} [batchSize=1000] - The number of records to send in each patch
	 * @returns {Promise<Result>} A batch process results object
	 */
	function batchDelete(recordType, codes, batchSize = 1000) {
		return processRecords(recordType, codes, client.batch.delete, batchSize);
	}

	return {
		batchPatch,
		batchDelete,
	};
}

module.exports = buildUtils;
