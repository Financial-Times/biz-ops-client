const https = require('https');
const urlJoin = require('url-join');
const makeRequest = require('./makeRequest');
const { version } = require('../package.json');

/**
 * Configure requests
 * @param {import('./BizOpsClient').Options} options
 * @returns {import('./makeRequest')}
 */
function createTransport(options) {
	const agent = new https.Agent({
		keepAlive: true,
	});

	const headers = {
		'x-api-key': options.apiKey,
		'client-id': options.systemCode || undefined,
		'client-user-id': options.userID || undefined,
		'user-agent': `biz-ops-client/${version}`,
	};

	/**
	 * Wraps HTTP requests with authentication
	 * @param {String} path
	 * @param {import('fetch').RequestInit} [options]
	 */
	return (path, init) => {
		// TODO: make interfaces the same as fetch
		const endpoint = urlJoin(options.host, path);
		return makeRequest(endpoint, { ...init, agent }, headers);
	};
}

module.exports = createTransport;
