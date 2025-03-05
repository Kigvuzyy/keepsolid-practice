import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";

import { authService } from "@/services/api/auth.service";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ISignInBody, ISignInResponse } from "@kigvuzyy/types";

export class SignIn {
	public async read(
		this: void,
		req: Request<ParamsDictionary, ISignInResponse, ISignInBody>,
		res: Response<ISignInResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.signIn(req.body);
		req.session = { jwt: response.data.token };
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			user: response.data.user,
		});
	}
}
