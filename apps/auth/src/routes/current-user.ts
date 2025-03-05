import express from "express";
import { validateBody, validateParams } from "@kigvuzyy/common";
import { refreshTokenParamsSchema, resendEmailBodySchema } from "@kigvuzyy/schemas";

import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { RefreshTokenParams, ResendEmailBody } from "@kigvuzyy/schemas";
import type {
	ICurrentUserResponse,
	IResendEmailResponse,
	IRefreshTokenGatewayResponse,
} from "@kigvuzyy/types";

import { CurrentUserController } from "@/controllers/current-user";
import { RefreshTokenController } from "@/controllers/refresh-token";

class CurrentUserRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get<RefreshTokenParams, IRefreshTokenGatewayResponse>(
			"/refresh-token/:username",
			validateParams(refreshTokenParamsSchema),
			RefreshTokenController.prototype.token,
		);
		this.router.get<ParamsDictionary, ICurrentUserResponse>(
			"/currentuser",
			CurrentUserController.prototype.read,
		);
		this.router.post<ParamsDictionary, IResendEmailResponse, ResendEmailBody>(
			"/resend-email",
			validateBody(resendEmailBodySchema),
			CurrentUserController.prototype.resendEmail,
		);

		return this.router;
	}
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
