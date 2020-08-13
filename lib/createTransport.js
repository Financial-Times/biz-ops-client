const https = require('https');
const urlJoin = require('url-join');
const mixinDeep = require('mixin-deep');
const { RateLimit } = require('async-sema');
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

	const limit = RateLimit(options.rps);

	/**
	 * @type {import('./makeRequest.js')}
	 */
	const transport = async (path, userInit) => {
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

		await limit();

		return makeRequest(url, requestInit);
	};

	return transport;
}

module.exports = createTransport;
