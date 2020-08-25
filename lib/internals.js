const https = require('https');
const { pRateLimit } = require('p-ratelimit');

function createAgent() {
	return new https.Agent({
		keepAlive: true,
	});
}

// NOTE: API Gateway has a limit of 100 requests every 5 seconds.
// We've set the rate at slightly under this limit (18rps) to decrease the chance of random
// variations accidentally bunching too many requests together and going over this limit.
// <https://github.com/Financial-Times/biz-ops-client/pull/8#discussion_r470482942>
function createQueue() {
	return pRateLimit({
		interval: 1000,
		rate: 18,
	});
}

module.exports = { createAgent, createQueue };
