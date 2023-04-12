const urlJoin = require('url-join');
const mixinDeep = require('mixin-deep');
const makeRequest = require('./makeRequest');
const { version } = require('../package.json');

/**
 * Wraps requests with authentication and other defaults
 * @param {import('./BizOpsClient').Options} options
 * @param {import('./BizOpsClient').InternalOptions} internalOptions
 */
function createTransport(options, { agent, queue }) {
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

		return queue.schedule(() => makeRequest(url, requestInit));
	};

	return transport;
}

module.exports = createTransport;
