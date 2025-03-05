import express from "express";

import type { Router } from "express";

import { Health } from "@/controllers/health";

class HealthRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get("/gateway-health", Health.prototype.health);

		return this.router;
	}
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
