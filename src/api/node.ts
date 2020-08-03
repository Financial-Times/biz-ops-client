import { stringify } from 'querystring';
import { FactoryOptions } from '../createAPI';

export interface INodeBody extends Object {
	code?: string;
	[key: string]: any;
}

export interface INodeParams extends Object {
	/**
	 * allow the creation of any new nodes needed to create relationships
	 */
	upsert?: Boolean;

	/**
	 * prevents any other system writing the fields listed here
	 */
	lockFields?: string;

	/**
	 * enables any system to write the fields listed here
	 */
	unlockFields?: string;

	/**
	 * specifies the behaviour when modifying relationships
	 */
	relationshipAction?: 'replace' | 'merge';
}

function buildNode(options: FactoryOptions) {
	const { makeRequest } = options;

	/**
	 * Make a Biz Ops API HEAD request to verify if a record exists
	 */
	async function nodeHead(type: string, code: string): Promise<Boolean> {
		await makeRequest(`/v2/node/${type}/${code}`, {
			method: 'HEAD',
		});

		return true;
	}

	/**
	 * Make a Biz Ops API POST request to create a new record
	 */
	async function nodePost<T>(
		type: string,
		code: string,
		body: INodeBody,
		params: INodeParams = {},
	): Promise<T> {
		const qs = stringify(params);

		return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
			method: 'POST',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API PATCH request to update an existing record
	 */
	async function nodePatch<T>(
		type: string,
		code: string,
		body: INodeBody,
		params: INodeParams = {},
	): Promise<T> {
		const qs = stringify(params);

		return makeRequest(`/v2/node/${type}/${code}${qs ? '?' : ''}${qs}`, {
			method: 'PATCH',
			body: JSON.stringify(body),
		});
	}

	/**
	 * Make a Biz Ops API DELETE request to destroy an existing record
	 */
	async function nodeDelete(type: string, code: string): Promise<Boolean> {
		await makeRequest(`/v2/node/${type}/${code}`, {
			method: 'DELETE',
		});

		return true;
	}

	return {
		head: nodeHead,
		post: nodePost,
		patch: nodePatch,
		delete: nodeDelete,
	};
}

export default buildNode;
