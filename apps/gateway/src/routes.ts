import type { Application } from "express";

import { authRoutes } from "@/routes/auth";
import { bookRoutes } from "@/routes/book";
import { healthRoutes } from "@/routes/health";
import { authMiddleware } from "@/middlewares/auth";
import { currentUserRoutes } from "@/routes/current-user";

class AppRoutes {
	public static readonly BASE_PATH = "/api/gateway/v1";

	public routes(app: Application): void {
		app.use("", healthRoutes.routes());

		app.use(AppRoutes.BASE_PATH, authRoutes.routes());
		app.use(AppRoutes.BASE_PATH, bookRoutes.routes());
		app.use(AppRoutes.BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
	}
}

export const appRoutes: AppRoutes = new AppRoutes();
