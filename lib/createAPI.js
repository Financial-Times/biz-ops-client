const graphQL = require('./api/graphQL');

function apiFactory(makeRequest) {
	return {
		graphQL: {
			get: graphQL.get.bind(null, makeRequest),
			post: graphQL.post.bind(null, makeRequest),
		},
	};
}

module.exports = apiFactory;
