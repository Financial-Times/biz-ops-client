const https = require('https');
const fetch = require('node-fetch');
const createError = require('http-errors');

const agent = new https.Agent({
	keepAlive: true,
});

async function makeRequest(url, body, headers) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...headers,
		},
		agent,
		body,
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
