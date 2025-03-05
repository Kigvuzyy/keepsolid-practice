import { setTimeout } from "node:timers";

import { Client } from "@elastic/elasticsearch";
import { winstonLogger } from "@kigvuzyy/common";

import type { Logger } from "winston";
import type {
	GetResponse,
	ClusterHealthResponse,
	IndicesExistsResponse,
} from "@elastic/elasticsearch/lib/api/types";

import { config } from "@/lib/config";

const logger: Logger = winstonLogger(
	`${config.ELASTIC_SEARCH_URL}`,
	"booksElasticSearchServer",
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
				this.logger.error(`BooksService checkConnection() method: ${error}`);
				await new Promise(async (resolve) => setTimeout(resolve, 2000));
			}
		}
	}

	public getClient(): Client {
		return this.client;
	}

	public async indexExists(indexName: string): Promise<IndicesExistsResponse> {
		const result: IndicesExistsResponse = await this.client.indices.exists({
			index: indexName,
		});

		return result;
	}

	public async createIndexIfNotExists(indexName: string): Promise<void> {
		try {
			const exists: boolean = await this.indexExists(indexName);

			if (exists) {
				this.logger.info(`Index "${indexName}" already exist.`);
				return;
			}

			await this.client.indices.create({
				index: indexName,
			});
			await this.client.indices.refresh({
				index: indexName,
			});

			this.logger.info(`Created index "${indexName}"`);
		} catch (error) {
			this.logger.error(`An error occured while creating the index "${indexName}"`);
			this.logger.log(
				"error",
				"BooksService elasticsearch createIndex() method error:",
				error,
			);
		}
	}

	public async getDocument<TDoc>(indexName: string, docId: string): Promise<TDoc | null> {
		try {
			const result: GetResponse<TDoc> = await this.client.get<TDoc>({
				index: indexName,
				id: docId,
			});

			return result._source ?? null;
		} catch (error) {
			this.logger.log(
				"error",
				"BooksService elasticsearch getIndexedData() method error:",
				error,
			);

			return null;
		}
	}

	public async indexDocument<TDoc>(
		indexName: string,
		docId: string,
		document: TDoc,
	): Promise<void> {
		try {
			await this.client.index<TDoc>({
				index: indexName,
				id: docId,
				document: document,
			});
		} catch (error) {
			this.logger.log(
				"error",
				"BooksService elasticsearch addDataToIndex() method error:",
				error,
			);

			throw error;
		}
	}

	public async updateDocument<TDoc>(
		index: string,
		itemId: string,
		partialDoc: Partial<TDoc>,
	): Promise<void> {
		try {
			await this.client.update({
				index,
				id: itemId,
				doc: partialDoc,
			});
		} catch (error) {
			this.logger.log(
				"error",
				"BooksService elasticsearch updateIndexedData() method error:",
				error,
			);

			throw error;
		}
	}

	public async deleteDocument(index: string, docId: string): Promise<void> {
		try {
			await this.client.delete({
				index,
				id: docId,
			});
		} catch (error) {
			this.logger.log(
				"error",
				"BooksService elasticsearch updateIndexedData() method error:",
				error,
			);

			throw error;
		}
	}
}

export const elasticsearchService: ElasticsearchService = new ElasticsearchService(logger);
