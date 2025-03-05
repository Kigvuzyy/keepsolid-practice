import express from "express";

import type { Router } from "express";

import { authMiddleware } from "@/middlewares/auth";
import { Refresh } from "@/controllers/auth/refresh-token";
import { CurrentUser } from "@/controllers/auth/current-user";

class CurrentUserRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get(
			"/auth/refresh-token/:username",
			authMiddleware.checkAuthentication,
			Refresh.prototype.token,
		);
		this.router.get(
			"/auth/currentuser",
			authMiddleware.checkAuthentication,
			CurrentUser.prototype.read,
		);
		this.router.post(
			"/auth/resend-email",
			authMiddleware.checkAuthentication,
			CurrentUser.prototype.resendEmail,
		);

		return this.router;
	}
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
