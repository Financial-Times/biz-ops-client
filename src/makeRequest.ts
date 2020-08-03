import fetch, { RequestInit } from 'node-fetch';
import createError from 'http-errors';

/**
 * Make an HTTP request
 * @throws {HTTPError} Will throw an HTTP error for non-200 responses
 */
async function makeRequest(url: string, init: RequestInit = {}): Promise<any> {
	const response = await fetch(url, init);

	const contentType = response.headers.get('Content-Type');

	let result;
	let errors;

	if (contentType && contentType.includes('application/json')) {
		result = await response.json();
	} else {
		result = await response.text();
	}

	if (response.ok) {
		return result;
	}

	if (result.errors) {
		try {
			errors = result.errors[0].message;
		} catch (e) {
			errors = 'API response included errors';
		}
	}

	throw createError(response.status, errors, {
		details: result,
	});
}

export default makeRequest;
