import http from "node:http";
import process from "node:process";

import hpp from "hpp";
import cors from "cors";
import axios from "axios";
import helmet from "helmet";
import compression from "compression";
import cookieSession from "cookie-session";
import { json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import { winstonLogger, CustomError } from "@kigvuzyy/common";

import type { Logger } from "winston";
import type { IError } from "@kigvuzyy/common";
import type { Application, Request, Response, NextFunction } from "express";

import { appRoutes } from "@/routes";
import { config } from "@/lib/config";
import { elasticsearchService } from "@/lib/elasticsearch";
import { axiosAuthInstance } from "@/services/api/auth.service";
import { axiosBookInstance } from "@/services/api/book.service";

import "express-async-errors";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL, "gatewayServer", "debug");

export class GatewayServer {
	private readonly app: Application;

	public constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware();
		this.standardMiddleware();
		this.routesMiddleware();
		this.startElasticSearch();
		this.gatewayErrorHandler();
		this.startServer();
	}

	private securityMiddleware(): void {
		this.app.set("trust proxy", 1);
		this.app.use(
			cookieSession({
				name: "session",
				keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
				maxAge: 24 * 7 * 3600 * 1000,
				secure: process.env.NODE_ENV !== "dev",
				...(process.env.NODE_ENV !== "dev" && {
					sameSite: "none",
				}),
			}),
		);
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(
			cors({
				origin: config.CLIENT_URL,
				credentials: true,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			}),
		);
		this.app.use((req: Request, _res: Response, next: NextFunction) => {
			if (req.session?.jwt) {
				axiosAuthInstance.defaults.headers.Authorization = `Bearer ${req.session.jwt}`;
				axiosBookInstance.defaults.headers.Authorization = `Bearer ${req.session.jwt}`;
			}

			next();
		});
	}

	private standardMiddleware(): void {
		this.app.use(compression());
		this.app.use(json({ limit: "200mb" }));
		this.app.use(urlencoded({ extended: true, limit: "200mb" }));
	}

	private startElasticSearch(): void {
		void elasticsearchService.checkConnection();
	}

	private routesMiddleware(): void {
		appRoutes.routes(this.app);
	}

	private gatewayErrorHandler(): void {
		this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
			const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

			logger.log("error", `${fullUrl} endpoint does not exist`, "");
			res.status(StatusCodes.NOT_FOUND).json({
				message: "The endpoint called does not exist.",
			});

			next();
		});

		this.app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
			if (axios.isAxiosError<IError>(error) && error.response) {
				const data = error.response.data;
				logger.log("error", `GatewayService ${data.comingFrom}:`, data);
				res.status(error.response.status).json(data);
			}

			if (error instanceof CustomError) {
				logger.log("error", `GatewayService ${error.comingFrom}:`, error);
				res.status(error.statusCode).json(error.serializeErrors());
			}

			next();
		});
	}

	private startServer(): void {
		try {
			const httpServer: http.Server = new http.Server(this.app);
			logger.info(`Gateway server has started with process id ${process.pid}`);

			httpServer.listen(config.PORT, () => {
				logger.info(`Gateway server running on port ${config.PORT}`);
			});
		} catch (error) {
			logger.log("error", "GatewayService startServer() method error:", error);
		}
	}
}
