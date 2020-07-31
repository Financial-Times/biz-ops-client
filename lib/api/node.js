const { stringify } = require('querystring');

/**
 * @param {import('../createAPI').FactoryOptions} options
 */
function buildNode(options) {
	const { makeRequest } = options;

	/**
	 * Make a Biz Ops API HEAD request to verify if a record exists
	 * @param {String} type
	 * @param {String} code
	 */
	async function nodeHead(type, code) {
		await makeRequest(`/v2/node/${type}/${code}`, {
			method: 'HEAD',
		});

		return true;
	}

	/**
	 * Make a Biz Ops API POST request to create a new record
	 * @param {String} type
	 * @param {String} code
	 * @param {Object} body
	 * @param {Object} [params={}] - additional query string parameters
	 * @param {String} [params.lockFields] - prevents any other system writing the fields listed here
	 * @param {String} [params.unlockFields] - enables any system to write the fields listed here
	 * @param {Boolean} [params.upsert] - allow the creation of any new nodes needed to create relationships
	 */
	async function nodePost(type, code, body, params = {}) {
		const qs = stringify(params);

		return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
			method: 'POST',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API PATCH request to update an existing record
	 * @param {String} type
	 * @param {String} code
	 * @param {Object} body
	 * @param {Object} [params={}] - additional query string parameters
	 * @param {String} [params.lockFields] - prevents any other system writing the fields listed here
	 * @param {String} [params.unlockFields] - enables any system to write the fields listed here
	 * @param {String} [params.relationshipAction] - specifies the behaviour when modifying relationships
	 * @param {Boolean} [params.upsert] - allow the creation of any new nodes needed to create relationships
	 */
	async function nodePatch(type, code, body, params = {}) {
		const qs = stringify(params);

		return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API HEAD request to check if a node exists
	 * @param {String} type
	 * @param {String} code
	 */
	async function nodeDelete(type, code) {
		await makeRequest(`/v2/node/${type}/${code}`, {
			method: 'DELETE',
		});

		return true;
	}

	return {
		head: nodeHead,
		post: nodePost,
		patch: nodePatch,
		delete: nodeDelete,
	};
}

module.exports = buildNode;
