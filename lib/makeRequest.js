const https = require('https');
const fetch = require('node-fetch');
const BizOpsClientError = require('./BizOpsClientError');

const agent = new https.Agent({
	keepAlive: true,
});

async function makeRequest(endpoint, body, headers) {
	const response = await fetch(endpoint, {
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

	if (response.ok && !result.errors && result.data) {
		return result.data;
	}
	const errors = typeof result === 'string' ? result : result.errors;
	throw new BizOpsClientError({ errors, status: response.status });
}

module.exports = makeRequest;
