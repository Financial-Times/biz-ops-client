const urlJoin = require('url-join');
const makeRequest = require('./makeRequest');
const graphQL = require('./graphQL');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} systemCode - A Biz Ops system code which identifies your service
 * @property {Number} [cacheLength=60000] - Time in milliseconds to store successful responses in memory;
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 */

const defaultOptions = {
	cacheLength: process.env.NODE_ENV === 'production' ? 1000 * 60 : -1,
	host: 'https://api.ft.com/biz-ops',
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
	async request(query, variables) {
		const host = urlJoin(this.options.host, '/graphql');

		const body = JSON.stringify({
			query,
			variables: variables || undefined,
		});

		const result = await makeRequest(host, body, {
			'Client-ID': this.options.systemCode,
			'X-Api-Key': this.options.apiKey,
		});

		return graphQL.handleResult(result);
	}
}

module.exports = BizOpsClient;
