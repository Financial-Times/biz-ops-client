const urlJoin = require('url-join');
const queryString = require('../utils/queryString');

/**
 * @param {string} baseUrl - the base url for node actions. Will default to '/v1/batch' if no `batchEndpoint` option is provided.
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildPatch(baseUrl, options) {
	const { makeRequest } = options;

	/**
	 * Make a Biz Ops API batch PATCH request to create or update batch of records
	 * @param {String} recordType - The Biz Ops record type to create or update
	 * @param {Object[]} body - JSON array of records to create or update
	 * @param {Object} [params={}] - additional query string parameters
	 * @param {String} [params.dryRun] - perform a dry run of the operation
	 * @returns {Promise<Object>}
	 */
	async function batchPatch(recordType, body, params = {}) {
		const qs = queryString(params);

		const url = urlJoin(baseUrl, recordType, `${qs ? '?' : ''}${qs}`);

		return makeRequest(url, {
			method: 'PATCH',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API batch DELETE request to delete batch of records
	 * @param {String} recordType - The Biz Ops record type to delete
	 * @param {String[]} codes - A JSON array of record codes to delete
	 * @param {Object} [params={}] - additional query string parameters
	 * @param {String} [params.dryRun] - perform a dry run of the operation
	 * @returns {Promise<Object>}
	 */
	async function batchDelete(recordType, codes, params = {}) {
		const qs = queryString(params);

		const url = urlJoin(baseUrl, recordType, `${qs ? '?' : ''}${qs}`);

		return makeRequest(url, {
			method: 'DELETE',
			body: JSON.stringify(codes),
		});
	}

	return {
		patch: batchPatch,
		delete: batchDelete,
	};
}

module.exports = buildPatch;
