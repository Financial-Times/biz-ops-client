const https = require('https');
const urlJoin = require('url-join');
const mixinDeep = require('mixin-deep');
const { pRateLimit } = require('p-ratelimit');
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

	// NOTE: API Gateway has a limit of 100 requests every 5 seconds.
	// We've set the rate at slightly under this limit (18rps) to decrease the chance of random
	// variations accidentally bunching too many requests together and going over this limit.
	// <https://github.com/Financial-Times/biz-ops-client/pull/8#discussion_r470482942>
	const limit = pRateLimit({
		interval: 1000,
		rate: 18,
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
		};

		if (options.systemCode) {
			headers['client-id'] = options.systemCode;
		}

		if (options.userID) {
			headers['client-user-id'] = options.userID;
		}

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

		return limit(() => makeRequest(url, requestInit));
	};

	return transport;
}

module.exports = createTransport;
