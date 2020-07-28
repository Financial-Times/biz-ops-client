class BizOpsClientError extends Error {
	constructor({ errors, status }) {
		let message;

		if (typeof errors === 'string') {
			message = errors;
		} else {
			try {
				message = errors[0].message;
			} catch (e) {
				message = `GraphQL API responded with a ${status}`;
			}
		}

		super(message);

		this.status = status;
		this.errors = errors;
	}
}

module.exports = BizOpsClientError;
