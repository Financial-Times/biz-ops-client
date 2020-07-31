const https = require('https');
const mixin = require('mixin-deep');
const urlJoin = require('url-join');
const makeRequest = require('./makeRequest');
const { version } = require('../package.json');

/**
 * Wraps requests with authentication and other defaults
 * @param {import('./BizOpsClient').Options} options
 * @returns {import('./makeRequest')}
 */
function createTransport(options) {
	const agent = new https.Agent({
		keepAlive: true,
	});

	return (path, userInit) => {
		const url = urlJoin(options.host, path);

		const defaultInit = {
			method: 'GET',
			timeout: options.timeout,
		};

		const headers = {
			'content-type': 'application/json',
			'user-agent': `biz-ops-client/${version}`,
			'x-api-key': options.apiKey,
			'client-id': options.systemCode || undefined,
			'client-user-id': options.userID || undefined,
		};

		const requestInit = mixin(defaultInit, userInit, { headers, agent });

		return makeRequest(url, requestInit);
	};
}

module.exports = createTransport;
