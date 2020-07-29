const api = require('./api');

/**
 * @typedef Options
 * @property {String} apiKey - API key for the FT API Gateway
 * @property {String} systemCode - A Biz Ops system code which identifies your service
 * @property {String} [host="https://api.ft.com/biz-ops"] - API key for the FT API Gateway
 */

const defaultOptions = {
	host: 'https://api.ft.com/biz-ops',
};

class BizOpsClient {
	/**
	 * Initialise an instance of the Biz Ops API Client
	 * @param {Options} userOptions - Client options
	 * @throws {TypeError} Will throw if any options are invalid.
	 */
	constructor(userOptions) {
		/** @type {Options} */
		this.options = { ...defaultOptions, ...userOptions };

		if (typeof this.options.apiKey !== 'string') {
			throw new TypeError(
				'A key for the FT API Gateway is required to request data from Biz Ops',
			);
		}

		if (typeof this.options.systemCode !== 'string') {
			throw new TypeError(
				'You must provide a valid system code to request data from Biz Ops',
			);
		}

		Object.assign(this, api(this.options));
	}
}

module.exports = BizOpsClient;
