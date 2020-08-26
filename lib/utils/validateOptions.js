const { ConfigurationError } = require('../errors');

/**
 * Validates user options when initialising a client
 * @param {import('../BizOpsClient').Options} options
 * @throws {ConfigurationError} Will throw if any options are invalid.
 */
function validateOptions(options) {
	if (typeof options.apiKey !== 'string') {
		throw new ConfigurationError(
			'A key for the FT API Gateway is required to request data from Biz Ops',
		);
	}

	if (
		typeof options.userID !== 'string' &&
		typeof options.systemCode !== 'string'
	) {
		throw new ConfigurationError(
			'You must provide a valid system code or user ID to request data from Biz Ops',
		);
	}

	if (typeof options.host !== 'string') {
		throw new ConfigurationError(
			'A host URL for the Biz Ops API is required',
		);
	}

	if (typeof options.timeout !== 'number') {
		throw new ConfigurationError(
			'A timeout (in milliseconds) is required and must be a number',
		);
	}
}

module.exports = validateOptions;
