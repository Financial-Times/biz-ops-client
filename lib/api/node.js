const { stringify } = require('querystring');

/**
 * Make a Biz Ops API HEAD request to verify if a record exists
 * @param {import('../makeRequest')} makeRequest
 * @param {String} type
 * @param {String} code
 */
async function head(makeRequest, type, code) {
	await makeRequest(`/v2/node/${type}/${code}`, {
		method: 'HEAD',
	});

	return true;
}

/**
 * Make a Biz Ops API POST request to create a new record
 * @param {import('../makeRequest')} makeRequest
 * @param {String} type
 * @param {String} code
 * @param {Object} body
 * @param {Object} [params={}] - additional query string parameters
 * @param {Boolean} [params.upsert] - allow the creation of any new nodes needed to create relationships
 * @param {String} [params.lockFields] - prevents any other system writing the fields listed here
 * @param {String} [params.unlockFields] - enables any system to write the fields listed here
 */
async function post(makeRequest, type, code, body, params = {}) {
	const qs = stringify(params);

	return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
		method: 'POST',
		body: JSON.stringify(body),
	});
}

/**
 * Make a Biz Ops API PATCH request to update an existing record
 * @param {import('../makeRequest')} makeRequest
 * @param {String} type
 * @param {String} code
 * @param {Object} body
 * @param {Object} [params={}] - additional query string parameters
 * @param {Boolean} [params.upsert] - allow the creation of any new nodes needed to create relationships
 * @param {String} [params.lockFields] - prevents any other system writing the fields listed here
 * @param {String} [params.unlockFields] - enables any system to write the fields listed here
 * @param {String} [params.relationshipAction] - specifies the behaviour when modifying relationships
 */
async function patch(makeRequest, type, code, body, params = {}) {
	const qs = stringify(params);

	return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
		method: 'PATCH',
		body: JSON.stringify(body),
	});
}

/**
 * Make a Biz Ops API HEAD request to check if a node exists
 * @param {import('../makeRequest')} makeRequest
 * @param {String} type
 * @param {String} code
 */
async function _delete(makeRequest, type, code) {
	await makeRequest(`/v2/node/${type}/${code}`, {
		method: 'DELETE',
	});

	return true;
}

module.exports = { head, post, patch, delete: _delete };
