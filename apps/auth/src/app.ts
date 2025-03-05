import "@/apm";

import express from "express";

import type { Express } from "express";

import { AuthServer } from "@/server";

class Application {
	public initialize(): void {
		const app: Express = express();
		const server: AuthServer = new AuthServer(app);
		server.start();
	}
}

const application: Application = new Application();
application.initialize();
