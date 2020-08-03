const subject = require('../queryString');

describe('lib/utils/queryString', () => {
	it('creates a query string from an object', () => {
		const result = subject({ foo: 'bar', baz: 123 });
		expect(result).toEqual('foo=bar&baz=123');
	});

	it('excludes any empty properties', () => {
		const result = subject({
			foo: 'bar',
			baz: null,
			qux: undefined,
			quux: 0,
		});

		expect(result).toEqual('foo=bar&quux=0');
	});
});
