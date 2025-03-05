import { setTimeout } from "node:timers";

import { Client } from "@elastic/elasticsearch";
import { winstonLogger } from "@kigvuzyy/common";

import type { Logger } from "winston";
import type { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types";

import { config } from "@/lib/config";

const logger: Logger = winstonLogger(
	`${config.ELASTIC_SEARCH_URL}`,
	"gatewayElasticSearchServer",
	"debug",
);

export class ElasticsearchService {
	private readonly client: Client;

	private readonly logger: Logger;

	public constructor(logger: Logger) {
		this.logger = logger;

		this.client = new Client({
			node: config.ELASTIC_SEARCH_URL,
		});
	}

	public async checkConnection(): Promise<void> {
		let isConnected = false;

		while (!isConnected) {
			try {
				const health: ClusterHealthResponse = await this.client.cluster.health({});
				this.logger.info(`Elasticsearch health status - ${health.status}`);
				isConnected = true;
			} catch (error) {
				this.logger.error("Connection to Elasticsearch failed. Retrying...");
				this.logger.error(`GatewayService checkConnection() method: ${error}`);
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
		}
	}

	public getClient(): Client {
		return this.client;
	}
}

export const elasticsearchService: ElasticsearchService = new ElasticsearchService(logger);
