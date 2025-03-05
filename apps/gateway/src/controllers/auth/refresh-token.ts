import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { IRefreshTokenParams, IRefreshTokenResponse } from "@kigvuzyy/types";

import { authService } from "@/services/api/auth.service";

export class Refresh {
	public async token(
		this: void,
		req: Request<IRefreshTokenParams, IRefreshTokenResponse>,
		res: Response<IRefreshTokenResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.getRefreshToken(`${req.params.username}`);
		req.session = { jwt: response.data.token };
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			user: response.data.user,
		});
	}
}
