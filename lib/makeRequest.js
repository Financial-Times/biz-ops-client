const fetch = require('node-fetch').default;
const createError = require('http-errors');
const logger = require('@dotcom-reliability-kit/logger');

/**
 * Make HTTP request
 * @param {String} url
 * @param {import('node-fetch').RequestInit} [init={}]
 * @returns {Promise<any>}
 * @throws {HTTPError} Will throw an HTTP error for non-200 responses
 */
async function makeRequest(url, init = {}) {
	logger.debug({
		event: 'SENDING_REQUEST_TO_BIZ_OPS_API',
		'client-id': init.headers?.['client-id'],
		'client-user-id': init.headers?.['client-user-id'],
		url,
		method: init.method || 'GET',
	});
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
		details: result,
	});
}

module.exports = makeRequest;
