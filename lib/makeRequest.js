const https = require('https');
const fetch = require('node-fetch');
const createError = require('http-errors');

const { version } = require('../package.json');

const userAgent = `biz-ops-client/${version}`;

const agent = new https.Agent({
	keepAlive: true,
});

/**
 * Make HTTP request
 * @param {String} url
 * @param {Object} options
 * @param {Object} headers
 * @throws {HTTPError} Will throw an HTTP error for non-200 responses
 */
async function makeRequest(url, options, headers) {
	const response = await fetch(url, {
		method: 'GET',
		timeout: 8000,
		...options,
		headers: {
			'content-type': 'application/json',
			'user-agent': userAgent,
			...headers,
		},
		agent,
	});

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
