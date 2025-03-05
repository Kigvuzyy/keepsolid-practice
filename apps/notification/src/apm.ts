import process from "node:process";

if (process.env.ENABLE_APM === "1") {
	/**
	 * The elastic-apm-node is not supporting ESM modules
	 */
	// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
	require("elastic-apm-node").start({
		serviceName: "notification",
		serverUrl: process.env.ELASTIC_APM_SERVER_URL,
		secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
		environment: process.env.NODE_ENV,
		active: true,
		captureBody: "all",
		errorOnAbortedRequests: true,
		captureErrorLogStackTraces: "always",
	});
}
