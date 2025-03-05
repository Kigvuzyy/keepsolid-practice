import { verifyGatewayRequest } from "@kigvuzyy/common";

import type { Application } from "express";

import { booksRoutes } from "@/routes/books";
import { healthRoutes } from "@/routes/health";
import { favouritesRoutes } from "@/routes/favourites";

class AppRoutes {
	public static readonly BASE_PATH = "/api/v1/books";

	public routes(app: Application): void {
		const verify = verifyGatewayRequest();

		app.use("", healthRoutes.routes());

		app.use(AppRoutes.BASE_PATH, verify, booksRoutes.routes());
		app.use(AppRoutes.BASE_PATH, verify, favouritesRoutes.routes());
	}
}

export const appRoutes: AppRoutes = new AppRoutes();
