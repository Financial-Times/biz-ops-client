/**
 * Handle Biz Ops response data
 * @param {*} result
 * @returns {*}
 * @throws {ValidationError|TypeError}
 */
function handleResult(result) {
	if (result.data && !result.errors) {
		return result.data;
	}

	// TODO: implement Validation errors!
	// if (result.errors) {
	// throw new ValidationError(result);
	// }

	throw new TypeError('Unexpected Biz Ops response format');
}

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
 */
async function post(makeRequest, type, code, body) {
	await makeRequest(`/v2/node/${type}/${code}`, {
		method: 'POST',
		body: JSON.stringify(body),
	});

	// TODO: handle validation errors

	return true;
}

/**
 * Make a Biz Ops API PATCH request to update an existing record
 * @param {import('../makeRequest')} makeRequest
 * @param {String} type
 * @param {String} code
 * @param {Object} body
 */
async function patch(makeRequest, type, code, body) {
	await makeRequest(`/v2/node/${type}/${code}`, {
		method: 'PATCH',
		body: JSON.stringify(body),
	});

	// TODO: handle validation errors

	return true;
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

module.exports = { handleResult, head, post, patch, delete: _delete };
