import "@/apm";

import express from "express";

import type { Express } from "express";

import { NotificationServer } from "@/server";

class Application {
	public initialize(): void {
		const app: Express = express();
		const server: NotificationServer = new NotificationServer(app);
		server.start();
	}
}

const application: Application = new Application();
application.initialize();
