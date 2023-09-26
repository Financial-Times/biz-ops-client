const registerCrashHandler = require('@dotcom-reliability-kit/crash-handler');
const BizOpsClient = require('./BizOpsClient');
/**
 * Reliability Kit method to ensure that fatal exceptions are logged.
 * The earlier this is called in your app, the more likely it is to
 * catch errors.
 *
 * @see https://github.com/Financial-Times/dotcom-reliability-kit/tree/main/packages/crash-handler#readme
 */
registerCrashHandler();

module.exports = { BizOpsClient };
