const createAPI = require('./createAPI');
const createTransport = require('./createTransport');
const { ConfigurationError } = require('./errors');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} [systemCode] - A Biz Ops system code which identifies your service
 * @property {String} [userID] - A user ID which identifies who is making a request
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 */

const defaultOptions = {
	host: 'https://api.ft.com/biz-ops',
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

		// Wrap calls to makeRequest() with authentication
		const transport = createTransport(this.options);

		Object.assign(this, createAPI(transport));
	}
}

module.exports = BizOpsClient;
