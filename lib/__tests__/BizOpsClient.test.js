const Subject = require('../BizOpsClient');

const OPTIONS = {
	apiKey: 'xxxx-xxxx-xxxx',
	systemCode: 'my-fab-app',
};

describe('lib/BizOpsClient', () => {
	describe('.constructor()', () => {
		let instance;

		describe('with valid options', () => {
			beforeAll(() => {
				instance = new Subject({ ...OPTIONS });
			});

			it('sets the given options', () => {
				expect(instance.options).toEqual(
					expect.objectContaining({
						apiKey: OPTIONS.apiKey,
						systemCode: OPTIONS.systemCode,
					}),
				);
			});

			it('sets default options', () => {
				expect(instance.options).toEqual(
					expect.objectContaining({
						host: expect.any(String),
					}),
				);
			});
		});

		describe('with invalid options', () => {
			it('throws if any required options are not provided', () => {
				expect(
					() => new Subject({ apiKey: null, systemCode: null }),
				).toThrow();
			});
		});
	});
});
