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
			it('throws a configuration error if required options are not set', () => {
				expect(
					() => new Subject({ apiKey: null, systemCode: null }),
				).toThrowError(
					expect.objectContaining({ name: 'ConfigurationError' }),
				);
			});
		});
	});

	describe('.child()', () => {
		let instance;
		let child;

		beforeAll(() => {
			instance = new Subject({ ...OPTIONS });
			child = instance.child({ userID: 'joe.bloggs' });
		});

		it('inherits parent options', () => {
			expect(child.options).toEqual(
				expect.objectContaining({
					apiKey: OPTIONS.apiKey,
					systemCode: OPTIONS.systemCode,
				}),
			);
		});

		it('inherits parent internals', () => {
			expect(child.internalOptions).toBe(instance.internalOptions);
		});

		it('merges new option overrides', () => {
			expect(child.options).toEqual(
				expect.objectContaining({
					userID: 'joe.bloggs',
				}),
			);
		});
	});
});
