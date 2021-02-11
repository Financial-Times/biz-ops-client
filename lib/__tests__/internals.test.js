const http = require('http');
const https = require('https');
const subject = require('../internals');

describe('lib/internals', () => {
	describe('.createAgent()', () => {
		it('creates an HTTP agent for non-secure host URLs', () => {
			const result = subject.createAgent('http://www.foo.bar');
			expect(result).toBeInstanceOf(http.Agent);
		});

		it('creates an HTTPS agent for secure host URLs', () => {
			const result = subject.createAgent('https://www.foo.bar');
			expect(result).toBeInstanceOf(https.Agent);
		});
	});
});
