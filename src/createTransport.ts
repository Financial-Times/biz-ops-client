import https from 'https';
import urlJoin from 'url-join';
import mixinDeep from 'mixin-deep';
import { RequestInit } from 'node-fetch';
import makeRequest from './makeRequest';
import { version } from '../package.json';
import { ClientOptions } from './BizOpsClient';

export type MakeRequest = (path: string, init?: RequestInit) => Promise<any>

function createTransport(options: ClientOptions): MakeRequest {
	const agent = new https.Agent({
		keepAlive: true,
	});

	return (path: string, userInit?: RequestInit) => {
		const url = urlJoin(options.host, path);

		const headers = {
			'content-type': 'application/json',
			'user-agent': `biz-ops-client/${version}`,
			'x-api-key': options.apiKey,
			'client-id': options.systemCode || undefined,
			'client-user-id': options.userID || undefined,
		};

		const requestInit = mixinDeep(
			{
				method: 'GET',
				timeout: options.timeout,
			},
			userInit,
			{
				headers,
				agent,
			},
		);

		return makeRequest(url, requestInit);
	};
}

export default createTransport;
