import { StatusCodes } from "http-status-codes";

import type { Request, Response } from "express";
import type { IRefreshTokenParams, IRefreshTokenGatewayResponse } from "@kigvuzyy/types";

import { omitUser } from "@/lib/util";
import { BadRequestError } from "@kigvuzyy/common";
import { authService } from "@/services/auth.service";

export class RefreshTokenController {
	public async token(
		this: void,
		req: Request<IRefreshTokenParams, IRefreshTokenGatewayResponse>,
		res: Response<IRefreshTokenGatewayResponse>,
	): Promise<void> {
		const { username } = req.params;

		const existingUser = await authService.getUserByUsername(username);

		if (!existingUser) {
			throw new BadRequestError("Invalid credentials", "RefreshToken token() method error");
		}

		const userJwt = authService.signToken({
			id: existingUser.id,
			email: existingUser.email,
			username: existingUser.username,
			role: existingUser.role,
		});

		res.status(StatusCodes.OK).json({
			message: "Refresh token",
			user: omitUser(existingUser),
			token: userJwt,
		});
	}
}
