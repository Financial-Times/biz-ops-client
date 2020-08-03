import buildGraphQL from './api/graphQL';
import { MakeRequest } from './createTransport';
// import buildNode from './api/node';

export interface FactoryOptions {
	makeRequest: MakeRequest
}

/**
 * Configures all API methods
 */
function createAPI(options: FactoryOptions) {
	return {
		graphQL: buildGraphQL(options),
		// node: buildNode(options),
	};
}

export default createAPI;
