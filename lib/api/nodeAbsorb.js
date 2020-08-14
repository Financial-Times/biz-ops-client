/**
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildNodeAbsorb(options) {
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

		return makeRequest(
			`/v2/node/${type}/${targetCode}/absorb/${sourceCode}`,
			{
				method: 'POST',
			},
		);
	}

	return {
		post: nodeAbsorbPost,
	};
}

module.exports = buildNodeAbsorb;
