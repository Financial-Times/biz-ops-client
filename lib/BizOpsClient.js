const { ConfigurationError } = require('./errors');
const buildNode = require('./api/node');
const buildNodeAbsorb = require('./api/nodeAbsorb');
const buildGraphQL = require('./api/graphQL');
const createTransport = require('./createTransport');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} [systemCode] - A Biz Ops system code which identifies your service
 * @property {String} [userID] - A user ID which identifies who is making a request
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 * @property {Number} [timeout=15000] - Maximum time in ms to wait for a response
 */

/**
 * @typedef FactoryOptions
 * @property {import('./makeRequest')} makeRequest
 */

/**
 * @type {Partial<Options>}
 */
const defaultOptions = {
	host: 'https://api.ft.com/biz-ops',
	timeout: 15000,
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

		/** @type {FactoryOptions} */
		const apiFactoryOptions = {
			makeRequest,
		};

		// The API methods are attached manually to ensure that all
		// JSDoc/TypeScript type information can be inferred.
		this.node = buildNode(apiFactoryOptions);
		this.nodeAbsorb = buildNodeAbsorb(apiFactoryOptions);
		this.graphQL = buildGraphQL(apiFactoryOptions);
	}
}

module.exports = BizOpsClient;
