const createAPI = require('./createAPI');
const createTransport = require('./createTransport');
const { ConfigurationError } = require('./errors');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} [systemCode] - A Biz Ops system code which identifies your service
 * @property {String} [userID] - A user ID which identifies who is making a request
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 * @property {Number} [timeout=8000] - Maximum time in ms to wait for a response
 */

/**
 * @type {Partial<Options>}
 */
const defaultOptions = {
	host: 'https://api.ft.com/biz-ops',
	timeout: 8000,
};

class BizOpsClient {
	/**
	 * Initialise an instance of the Biz Ops API Client
	 * @param {Options} userOptions - Client options
	 * @throws {ConfigurationError} Will throw if any options are invalid.
	 */
	constructor(userOptions) {
		/**
		 * @type {Options}
		 * @private
		 */
		this.options = { ...defaultOptions, ...userOptions };

		if (typeof this.options.apiKey !== 'string') {
			throw new ConfigurationError(
				'A key for the FT API Gateway is required to request data from Biz Ops',
			);
		}

		if (
			typeof this.options.userID !== 'string' &&
			typeof this.options.systemCode !== 'string'
		) {
			throw new ConfigurationError(
				'You must provide a valid system code or user ID to request data from Biz Ops',
			);
		}

		if (typeof this.options.host !== 'string') {
			throw new ConfigurationError(
				'A host URL for the Biz Ops API is required',
			);
		}

		const makeRequest = createTransport(this.options);
		const api = createAPI({ makeRequest });

		// The API methods are attached manually to ensure that all
		// JSDoc/TypeScript type information can be inferred.
		this.node = api.node;
		this.graphQL = api.graphQL;
	}
}

module.exports = BizOpsClient;
