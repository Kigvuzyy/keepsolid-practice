import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ISignUpBody, ISignUpResponse } from "@kigvuzyy/types";

import { authService } from "@/services/api/auth.service";

export class SignUp {
	public async create(
		this: void,
		req: Request<ParamsDictionary, ISignUpResponse, ISignUpBody>,
		res: Response<ISignUpResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.signUp(req.body);
		req.session = { jwt: response.data.token };
		res.status(StatusCodes.CREATED).json({
			message: response.data.message,
			user: response.data.user,
		});
	}
}
