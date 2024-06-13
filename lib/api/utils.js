/**
 * @typedef {import('../utils/batchUtils').Record} Record
 */

/**
 * @typedef {import('../utils/batchUtils').BatchResultWithDuration} Result
 */

const { processRecords } = require('../utils/batchUtils');

/**
 * @param {import('../BizOpsClient')} client - instance of the Biz Ops Client
 */
function buildUtils(client) {
	/**
	 * Batch patch utility
	 * @description Create batch PATCH requests for the given list of records
	 * @param {string} recordType
	 * @param {Record[]} records
	 * @returns {Promise<Result>}
	 */
	function batchPatch(recordType, records) {
		return processRecords(recordType, records, client.batch.patch);
	}

	/**
	 * Batch delete utility
	 * @description Create batch DELETE requests for the given list of records
	 * @param {string} recordType
	 * @param {Record[]} records
	 * @returns {Promise<Result>}
	 */
	function batchDelete(recordType, records) {
		return processRecords(recordType, records, client.batch.delete);
	}

	return {
		batchPatch,
		batchDelete,
	};
}

module.exports = buildUtils;
