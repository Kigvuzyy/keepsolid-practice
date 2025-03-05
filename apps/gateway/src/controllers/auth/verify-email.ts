import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { IVerifyEmailBody, IVerifyEmailResponse } from "@kigvuzyy/types";

import { authService } from "@/services/api/auth.service";

export class VerifyEmail {
	public async update(
		this: void,
		req: Request<ParamsDictionary, IVerifyEmailResponse, IVerifyEmailBody>,
		res: Response<IVerifyEmailResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.verifyEmail(req.body.token);
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			user: response.data.user,
		});
	}
}
