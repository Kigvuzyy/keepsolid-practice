import "@/apm";

import express from "express";

import type { Express } from "express";

import { BooksServer } from "@/server";

class Application {
	public initialize(): void {
		const app: Express = express();
		const server: BooksServer = new BooksServer(app);
		server.start();
	}
}

const application: Application = new Application();
application.initialize();
