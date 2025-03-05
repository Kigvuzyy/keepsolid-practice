import { verify } from "jsonwebtoken";
import { BadRequestError, NotAuthorizedError } from "@kigvuzyy/common";

import type { IAuthPayload } from "@kigvuzyy/common";
import type { NextFunction, Request, Response } from "express";

import { config } from "@/lib/config";

class AuthMiddleware {
	public verifyUser<TParams>(
		this: void,
		req: Request<TParams>,
		_res: Response,
		next: NextFunction,
	): void {
		const jwt = req.session?.jwt;

		if (!jwt) {
			throw new NotAuthorizedError(
				"Token is not available. Please login again.",
				"GatewayService verifyUser() method error",
			);
		}

		try {
			const payload: IAuthPayload = verify(jwt, config.JWT_TOKEN) as IAuthPayload;
			req.currentUser = payload;
		} catch (error) {
			throw new NotAuthorizedError(
				"Token is not available. Please login again.",
				"GatewayService verifyUser() method invalid session error",
			);
		}

		next();
	}

	public checkAuthentication<TParams>(
		this: void,
		req: Request<TParams>,
		_res: Response,
		next: NextFunction,
	): void {
		if (!req.currentUser) {
			throw new BadRequestError(
				"Authentication is required to access this route.",
				"GatewayService checkAuthentication() method error",
			);
		}

		next();
	}
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
