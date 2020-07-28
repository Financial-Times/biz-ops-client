class BizOpsClientError extends Error {
	constructor({ errors, status }) {
		let message;

		try {
			message = errors[0].message;
		} catch {
			message = `GraphQL Error (Code: ${status})`;
		}

		super(message);

		this.status = status;
		this.errors = errors;
	}
}

module.exports = BizOpsClientError;
