import { stringify } from 'querystring';
import { GraphQLError } from '../errors';
import { FactoryOptions } from '../createAPI';

export interface IGraphQLError {
	message: string;
	locations?: Array<{ line: number; column: number }>;
	path?: string[];
}

export interface IGraphQLResponse {
	data?: any;
	errors?: IGraphQLError[];
}

export interface IGraphQLVariables {
	[key: string]: any;
}

/**
 * Removes extraneous whitespace from a GraphQL query
 */
function formatQuery(query: string): string {
	return query.replace(/[ \t]+/g, ' ').trim();
}

/**
 * Throws if the GraphQL response data includes any errors
 */
function throwOnErrors(result: IGraphQLResponse) {
	if (result.data && !result.errors) {
		return result.data;
	}

	if (result.errors) {
		throw new GraphQLError(result);
	}

	throw new TypeError('Unexpected GraphQL response format');
}

function buildGraphQL(options: FactoryOptions) {
	const { makeRequest } = options;

	/**
	 * Make a GraphQL API GET request
	 */
	async function get<T>(
		query: string,
		variables: IGraphQLVariables = {},
		strict: Boolean = false,
	): Promise<T> {
		const qs = stringify({
			query: formatQuery(query),
			variables: JSON.stringify(variables),
		});

		const result = await makeRequest(`/graphql?${qs}`, { method: 'GET' });

		return strict ? throwOnErrors(result) : result.data;
	}

	/**
	 * Make a GraphQL API POST request
	 */
	async function post<T>(
		query: string,
		variables: IGraphQLVariables = {},
		strict: Boolean = false,
	): Promise<T> {
		const body = JSON.stringify({
			query,
			variables,
		});

		const result = await makeRequest('/graphql', { method: 'POST', body });

		return strict ? throwOnErrors(result) : result.data;
	}

	return { get, post };
}

export default buildGraphQL;
