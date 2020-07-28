const makeRequest = require('./makeRequest');
const BizOpsClientError = require('./BizOpsClientError');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} systemCode - A Biz Ops system code which identifies your service
 * @property {Number} [cacheLength=60000] - Time in milliseconds to store successful responses in memory;
 * @property {String} [endpoint="https://api.ft.com/biz-ops/graphql"] - API key for the FT API Gateway
 */

const defaultOptions = {
	cacheLength: process.env.NODE_ENV === 'production' ? 1000 * 60 : -1,
	endpoint: 'https://api.ft.com/biz-ops/graphql',
};

class BizOpsClient {
	/**
	 * Initialise an instance of the Biz Ops API Client
	 * @param {Options} options - Client options
	 * @throws {TypeError} Will throw if any options are invalid.
	 */
	constructor(options) {
		/** @type {Options} */
		this.options = { ...defaultOptions, ...options };

		if (typeof options.apiKey !== 'string') {
			throw new TypeError(
				'A key for the FT API Gateway is required to request data from Biz Ops',
			);
		}

		if (typeof options.systemCode !== 'string') {
			throw new TypeError(
				'You must provide a valid system code to request data from Biz Ops',
			);
		}
	}

	/**
	 * Make a GraphQL API request
	 * @param {String} query
	 * @param {Object} variables
	 */
	request(query, variables) {
		const body = JSON.stringify({
			query,
			variables: variables || undefined,
		});

		return makeRequest(this.options.endpoint, body, {
			'Client-ID': this.options.systemCode,
			'X-Api-Key': this.options.apiKey,
		});
	}
}

module.exports = { BizOpsClient, BizOpsClientError };
