import "@/apm";

import express from "express";

import type { Express } from "express";

import { GatewayServer } from "@/server";

class Application {
	public initialize(): void {
		const app: Express = express();
		const server: GatewayServer = new GatewayServer(app);
		server.start();
	}
}

const application: Application = new Application();
application.initialize();
