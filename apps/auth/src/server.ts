import http from "node:http";
import process from "node:process";

import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { json, urlencoded } from "express";
import { connectRabbit } from "@kigvuzyy/brokers";
import { winstonLogger, currentUser, CustomError } from "@kigvuzyy/common";

import type { Logger } from "winston";
import type { IErrorResponse } from "@kigvuzyy/common";
import type { Application, Request, Response, NextFunction } from "express";

import { appRoutes } from "@/routes";
import { config } from "@/lib/config";
import { elasticsearchService } from "@/lib/elasticsearch";

import "express-async-errors";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL, "authServer", "debug");

export class AuthServer {
	private readonly app: Application;

	public constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware();
		this.standardMiddleware();
		this.routesMiddleware();
		this.startQueues();
		this.startElasticSearch();
		this.authErrorHandler();
		this.startServer();
	}

	private securityMiddleware(): void {
		this.app.set("trust proxy", 1);
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(
			cors({
				origin: config.API_GATEWAY_URL,
				credentials: true,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			}),
		);
		this.app.use(currentUser());
	}

	private standardMiddleware(): void {
		this.app.use(compression());
		this.app.use(json({ limit: "200mb" }));
		this.app.use(urlencoded({ extended: true, limit: "200mb" }));
	}

	private routesMiddleware(): void {
		appRoutes.routes(this.app);
	}

	private startQueues(): void {
		void connectRabbit({ uri: config.RABBITMQ_ENDPOINT, logger });
	}

	private startElasticSearch(): void {
		void elasticsearchService.checkConnection();
	}

	private authErrorHandler(): void {
		this.app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
			logger.log("error", `AuthService ${error.comingFrom ?? "unknown error"}:`, error);

			if (error instanceof CustomError) {
				res.status(error.statusCode).json(error.serializeErrors());
			}

			next();
		});
	}

	private startServer(): void {
		try {
			const httpServer: http.Server = new http.Server(this.app);
			logger.info(`Auth server has started with process id ${process.pid}`);

			httpServer.listen(config.PORT, () => {
				logger.info(`Auth server running on port ${config.PORT}`);
			});
		} catch (error) {
			logger.log("error", "AuthService startServer() method error:", error);
		}
	}
}
