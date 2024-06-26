const buildNode = require('./api/node');
const buildNodeAbsorb = require('./api/nodeAbsorb');
const buildGraphQL = require('./api/graphQL');
const buildBatch = require('./api/batch');
const createTransport = require('./createTransport');
const validateOptions = require('./utils/validateOptions');
const { createAgent, createQueue } = require('./internals');
const buildUtils = require('./api/utils');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} [systemCode] - A Biz Ops system code which identifies your service
 * @property {String} [userID] - A user ID which identifies who is making a request
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 * @property {Number} [timeout=15000] - Maximum time in ms to wait for a response
 * @property {Number} [rps=18] - Maximum number of API requests per second
 */

/**
 * @typedef InternalOptions
 * @property {import('https').Agent} agent - reusable HTTPS agent
 * @property {Function} queue - reusable queue for rate limiting
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
	nodeEndpoint: '/v2/node',
	graphqlEndpoint: '/graphql',
	batchEndpoint: '/v1/batch',
	timeout: 15000,
	rps: 18,
};

class BizOpsClient {
	/**
	 * Initialise an instance of the Biz Ops API Client
	 * @param {Options} userOptions - Client options
	 * @param {InternalOptions} [internalOptions] - For internal use only
	 * @throws {ConfigurationError} Will throw if any options are invalid.
	 */
	constructor(userOptions, internalOptions) {
		/**
		 * @type {Options}
		 * @private
		 */
		this.options = { ...defaultOptions, ...userOptions };

		validateOptions(this.options);

		/**
		 * @type {InternalOptions}
		 * @private
		 */
		this.internalOptions = internalOptions || {
			agent: createAgent(this.options.host),
			queue: createQueue(this.options.rps),
		};

		const makeRequest = createTransport(this.options, this.internalOptions);

		/** @type {FactoryOptions} */
		const apiFactoryOptions = {
			makeRequest,
		};

		// The API methods are attached manually to ensure that all
		// JSDoc/TypeScript type information can be inferred.

		/**
		 * @type {ReturnType<buildNode>}
		 * @public
		 */
		this.node = buildNode(this.options.nodeEndpoint, apiFactoryOptions);

		/**
		 * @type {ReturnType<buildNodeAbsorb>}
		 * @public
		 */
		this.nodeAbsorb = buildNodeAbsorb(
			this.options.nodeEndpoint,
			apiFactoryOptions,
		);

		/**
		 * @type {ReturnType<buildGraphQL>}
		 * @public
		 */
		this.graphQL = buildGraphQL(
			this.options.graphqlEndpoint,
			apiFactoryOptions,
		);

		/**
		 * @type {ReturnType<buildNode>}
		 * @public
		 */
		this.batch = buildBatch(this.options.batchEndpoint, apiFactoryOptions);

		/**
		 * @type {ReturnType<buildUtils>}
		 * @public
		 */
		this.utils = buildUtils(this);
	}

	/**
	 * Creates a new client instance but maintains shared internals
	 * @param {Options} [userOptions] - Client options
	 */
	child(userOptions) {
		const options = { ...this.options, ...userOptions };
		const client = new BizOpsClient(options, this.internalOptions);

		return client;
	}
}

module.exports = BizOpsClient;
