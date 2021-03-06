const queryString = require('../utils/queryString');

/**
 * @param {import('../BizOpsClient').FactoryOptions} options
 */
function buildNode(options) {
	const { makeRequest } = options;

	/**
	 * Make a Biz Ops API HEAD request to verify if a record exists
	 * @param {String} type
	 * @param {String} code
	 * @returns {Promise<Boolean>}
	 */
	async function nodeHead(type, code) {
		code = encodeURIComponent(code);

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
	 * @returns {Promise<any>}
	 */
	async function nodePost(type, code, body, params = {}) {
		code = encodeURIComponent(code);

		const qs = queryString(params);

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
	 * @returns {Promise<any>}
	 */
	async function nodePatch(type, code, body, params = {}) {
		code = encodeURIComponent(code);

		const qs = queryString(params);

		return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API DELETE request to destroy an existing record
	 * @param {String} type
	 * @param {String} code
	 * @param {Object} [params={}] - additional query string parameters
	 * @param {Boolean} [params.force] - allow the deletion of a node even if it has relationships
	 * @returns {Promise<Boolean>}
	 */
	async function nodeDelete(type, code, params = {}) {
		code = encodeURIComponent(code);
		const qs = queryString(params);

		await makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
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
