const urlJoin = require('url-join');

/**
 * @param {string} baseUrl - the base url for absorb actions. Will be sent as '/v2/node' if no client options were provided.
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildNodeAbsorb(baseUrl, options) {
	const { makeRequest } = options;

	/**
	 * Merges two records by copying properties from the source node to the target
	 * node and deletes the original source node when complete.
	 * @param {String} type
	 * @param {String} targetCode
	 * @param {String} sourceCode
	 */
	async function nodeAbsorbPost(type, targetCode, sourceCode) {
		targetCode = encodeURIComponent(targetCode);
		sourceCode = encodeURIComponent(sourceCode);

		const url = urlJoin(baseUrl, type, targetCode, 'absorb', sourceCode);
		return makeRequest(url, {
			method: 'POST',
		});
	}

	return {
		post: nodeAbsorbPost,
	};
}

module.exports = buildNodeAbsorb;
