const http = require('http');
const https = require('https');
const { pRateLimit } = require('p-ratelimit');

/**
 * @param {String} host
 */
function createAgent(host) {
	const Agent = host.startsWith('https') ? https.Agent : http.Agent;

	return new Agent({
		keepAlive: true,
	});
}

// NOTE: API Gateway has a limit of 100 requests every 5 seconds.
// We've set the rate at slightly under this limit (18rps) to decrease the chance of random
// variations accidentally bunching too many requests together and going over this limit.
// <https://github.com/Financial-Times/biz-ops-client/pull/8#discussion_r470482942>

/**
 * @param {Number} rps - Maximum number of requests per second
 */
function createQueue(rps = 18) {
	return pRateLimit({
		interval: 1000,
		rate: rps,
	});
}

module.exports = { createAgent, createQueue };
