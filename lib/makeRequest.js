const fetch = require('node-fetch');
const createError = require('http-errors');

/**
 * Make HTTP request
 * @param {String} url
 * @param {import('node-fetch').RequestInit} init
 * @throws {HTTPError} Will throw an HTTP error for non-200 responses
 */
async function makeRequest(url, init) {
	const response = await fetch(url, init);

	const contentType = response.headers.get('Content-Type');

	let result;

	if (contentType && contentType.includes('application/json')) {
		result = await response.json();
	} else {
		result = await response.text();
	}

	if (response.ok) {
		return result;
	}

	throw createError(response.status, {
		response: result,
	});
}

module.exports = makeRequest;
