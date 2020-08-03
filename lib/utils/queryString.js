const { URLSearchParams } = require('url');

function queryString(params = {}) {
	/**
	 * @type Array<[string, string]>
	 */
	const definedParams = [];

	for (const [property, value] of Object.entries(params)) {
		if (value !== null && value !== undefined) {
			definedParams.push([property, String(value)]);
		}
	}

	return new URLSearchParams(definedParams).toString();
}

module.exports = queryString;
