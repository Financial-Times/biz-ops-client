const fetch = require('node-fetch').default;
const createError = require('http-errors');

/**
 * Make HTTP request
 * @param {String} url
 * @param {import('node-fetch').RequestInit} [init={}]
 * @returns {Promise<any>}
 * @throws {HTTPError} Will throw an HTTP error for non-200 responses
 */
async function makeRequest(url, init = {}) {
	const response = await fetch(url, init);

	const contentType = response.headers.get('Content-Type');

	let result;
	let errors;

	if (contentType && contentType.includes('application/json')) {
		result = await response.json();
	} else {
		result = await response.text();
	}

	if (response.ok) {
		return result;
	}

	if (result.errors) {
		try {
			errors = result.errors[0].message;
		} catch (e) {
			errors = 'API response included errors';
		}
	}

	throw createError(response.status, errors, {
		responseBody: result,
		details: result,
	});
}

module.exports = makeRequest;
