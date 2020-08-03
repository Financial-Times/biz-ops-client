import createTransport from './createTransport';
import { ConfigurationError } from './errors';
import buildGraphQL from './api/graphQL';
import buildNode from './api/node';

export interface ClientOptions {
	apiKey: string;
	systemCode?: string;
	userID?: string;
	/**
	 * @default "https://api.ft.com/biz-ops"
	 */
	host?: string;
	/**
	 * @default 8000
	 */
	timeout?: number;
}

export interface FactoryOptions {
	makeRequest: ReturnType<typeof createTransport>;
}

const defaultOptions: Partial<ClientOptions> = {
	host: 'https://api.ft.com/biz-ops',
	timeout: 8000,
};

class BizOpsClient {
	private options: ClientOptions;

	public node: ReturnType<typeof buildNode>;
	public graphQL: ReturnType<typeof buildGraphQL>;

	constructor(userOptions: ClientOptions) {
		this.options = { ...defaultOptions, ...userOptions };

		if (typeof this.options.apiKey !== 'string') {
			throw new ConfigurationError(
				'A key for the FT API Gateway is required to request data from Biz Ops',
			);
		}

		if (
			typeof this.options.userID !== 'string' &&
			typeof this.options.systemCode !== 'string'
		) {
			throw new ConfigurationError(
				'You must provide a valid system code or user ID to request data from Biz Ops',
			);
		}

		if (typeof this.options.host !== 'string') {
			throw new ConfigurationError(
				'A host URL for the Biz Ops API is required',
			);
		}

		const makeRequest = createTransport(this.options);

		const apiFactoryOptions: FactoryOptions = {
			makeRequest,
		};

		// The API methods are attached manually to ensure that all
		// type information can be inferred.
		this.node = buildNode(apiFactoryOptions);
		this.graphQL = buildGraphQL(apiFactoryOptions);
	}
}

export default BizOpsClient;
