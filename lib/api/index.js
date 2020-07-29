const graphQL = require('./graphQL');

module.exports = function api(options) {
	return {
		graphQL: {
			get: graphQL.get.bind(null, options),
			post: graphQL.post.bind(null, options),
		},
	};
};
