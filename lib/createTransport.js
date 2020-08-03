const https = require('https');
const urlJoin = require('url-join');
const mixinDeep = require('mixin-deep');
const makeRequest = require('./makeRequest');
const { version } = require('../package.json');

/**
 * Wraps requests with authentication and other defaults
 * @param {import('./BizOpsClient').Options} options
 */
function createTransport(options) {
	const agent = new https.Agent({
		keepAlive: true,
	});

	/**
	 * @type {import('./makeRequest.js')}
	 */
	const transport = (path, userInit) => {
		const url = urlJoin(options.host, path);

		const headers = {
			'content-type': 'application/json',
			'user-agent': `biz-ops-client/${version}`,
			'x-api-key': options.apiKey,
			'client-id': options.systemCode || undefined,
			'client-user-id': options.userID || undefined,
		};

		const requestInit = mixinDeep(
			{
				method: 'GET',
				timeout: options.timeout,
			},
			userInit,
			{
				headers,
				agent,
			},
		);

		return makeRequest(url, requestInit);
	};

	return transport;
}

module.exports = createTransport;
