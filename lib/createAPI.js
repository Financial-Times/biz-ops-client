const node = require('./api/node');
const graphQL = require('./api/graphQL');

/**
 * API Factory to bind all methods with the given configuration
 * @param {import('./makeRequest')} makeRequest
 */
function createAPI(makeRequest) {
	return {
		graphQL: {
			get: graphQL.get.bind(null, makeRequest),
			post: graphQL.post.bind(null, makeRequest),
		},
		node: {
			head: node.head.bind(null, makeRequest),
			post: node.post.bind(null, makeRequest),
			patch: node.patch.bind(null, makeRequest),
			delete: node.delete.bind(null, makeRequest),
		},
	};
}

module.exports = createAPI;
