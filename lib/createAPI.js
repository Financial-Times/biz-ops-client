const buildGraphQL = require('./api/graphQL');
const buildNode = require('./api/node');

/**
 * @typedef FactoryOptions
 * @property {import('./makeRequest')} makeRequest
 */

/**
 * Configures all API methods
 * @param {FactoryOptions} options
 */
function createAPI(options) {
	return {
		graphQL: buildGraphQL(options),
		node: buildNode(options),
	};
}

module.exports = createAPI;
