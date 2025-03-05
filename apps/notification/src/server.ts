import http from "node:http";
import process from "node:process";

import { winstonLogger } from "@kigvuzyy/common";
import { connectRabbit } from "@kigvuzyy/brokers";

import type { Logger } from "winston";
import type { Application } from "express";

import { appRoutes } from "@/routes";
import { config } from "@/lib/config";
import { elasticsearchService } from "@/lib/elasticsearch";
import { AuthMailConsumer } from "@/queues/consumers/auth-mail.consumer";

import "express-async-errors";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL, "notificationServer", "debug");

export class NotificationServer {
	private readonly app: Application;

	public constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.routesMiddleware();
		this.startQueues();
		this.startElasticSearch();
		this.startServer();
	}

	private routesMiddleware(): void {
		appRoutes.routes(this.app);
	}

	private startQueues(): void {
		void connectRabbit(
			{ uri: config.RABBITMQ_ENDPOINT, logger },
			async (channel, connection) => {
				const authMailConsumer = new AuthMailConsumer(channel, connection);

				authMailConsumer.on("info", (msg) => logger.info(msg));
				authMailConsumer.on("error", (err) =>
					logger.log("error", "NotificationService AuthMailConsumer error:", err),
				);

				await authMailConsumer.consume();
			},
		);
	}

	private startElasticSearch(): void {
		void elasticsearchService.checkConnection();
	}

	private startServer(): void {
		try {
			const httpServer: http.Server = new http.Server(this.app);
			logger.info(`Notification server has started with process id ${process.pid}`);

			httpServer.listen(config.PORT, () => {
				logger.info(`Notification server running on port ${config.PORT}`);
			});
		} catch (error) {
			logger.log("error", "NotificationService startServer() method error:", error);
		}
	}
}
