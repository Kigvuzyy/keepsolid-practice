import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ICurrentUserResponse, IResendEmailBody, IResendEmailResponse } from "@kigvuzyy/types";

import { authService } from "@/services/api/auth.service";

export class CurrentUser {
	public async read(
		this: void,
		_req: Request<ParamsDictionary, ICurrentUserResponse>,
		res: Response<ICurrentUserResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.getCurrentUser();
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			user: response.data.user,
		});
	}

	public async resendEmail(
		this: void,
		req: Request<ParamsDictionary, IResendEmailResponse, IResendEmailBody>,
		res: Response<IResendEmailResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.resendEmail(req.body);
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			user: response.data.user,
		});
	}
}
