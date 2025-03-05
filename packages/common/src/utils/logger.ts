import { createLogger, transports } from "winston";
import { ElasticsearchTransformer, ElasticsearchTransport } from "winston-elasticsearch";

import type { Logger } from "winston";
import type { LogData, TransformedData } from "winston-elasticsearch";

const esTransformer = (logData: LogData): TransformedData => {
	return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
	elasticsearchNode: string,
	name: string,
	level: string,
	handleExceptions: boolean = false,
): Logger => {
	const options = {
		console: {
			level,
			handleExceptions,
			json: false,
			colorize: true,
			forceConsole: true,
		},
		elasticsearch: {
			level,
			transformer: esTransformer,
			clientOpts: {
				node: elasticsearchNode,
				log: level,
				maxRetries: 2,
				requestTimeout: 10000,
				sniffOnStart: false,
			},
		},
	};

	const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);

	const logger: Logger = createLogger({
		exitOnError: false,
		defaultMeta: {
			service: name,
		},
		transports: [new transports.Console(options.console), esTransport],
	});

	return logger;
};
