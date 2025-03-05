import { verifyGatewayRequest } from "@kigvuzyy/common";

import type { Application } from "express";

import { authRoutes } from "@/routes/auth";
import { healthRoutes } from "@/routes/health";
import { currentUserRoutes } from "@/routes/current-user";

class AppRoutes {
	public static readonly BASE_PATH = "/api/v1/auth";

	public routes(app: Application): void {
		const verify = verifyGatewayRequest();

		app.use("", healthRoutes.routes());

		app.use(AppRoutes.BASE_PATH, verify, authRoutes.routes());
		app.use(AppRoutes.BASE_PATH, verify, currentUserRoutes.routes());
	}
}

export const appRoutes: AppRoutes = new AppRoutes();
