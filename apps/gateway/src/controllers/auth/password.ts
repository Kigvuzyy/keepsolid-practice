import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type {
	IChangePasswordBody,
	IChangePasswordResponse,
	IForgotPasswordBody,
	IForgotPasswordResponse,
	IResetPasswordBody,
	IResetPasswordParams,
	IResetPasswordResponse,
} from "@kigvuzyy/types";

import { authService } from "@/services/api/auth.service";

export class Password {
	public async forgotPassword(
		this: void,
		req: Request<ParamsDictionary, IForgotPasswordResponse, IForgotPasswordBody>,
		res: Response<IForgotPasswordResponse>,
	): Promise<void> {
		const response: AxiosResponse = await authService.forgotPassword(req.body.email);
		res.status(StatusCodes.OK).json({ message: response.data.message });
	}

	public async resetPassword(
		this: void,
		req: Request<IResetPasswordParams, IResetPasswordResponse, IResetPasswordBody>,
		res: Response<IResetPasswordResponse>,
	): Promise<void> {
		const { password, confirmPassword } = req.body;
		const response: AxiosResponse = await authService.resetPassword(
			`${req.params.token}`,
			password,
			confirmPassword,
		);
		res.status(StatusCodes.OK).json({ message: response.data.message });
	}

	public async changePassword(
		this: void,
		req: Request<ParamsDictionary, IChangePasswordResponse, IChangePasswordBody>,
		res: Response<IChangePasswordResponse>,
	): Promise<void> {
		const { currentPassword, newPassword } = req.body;
		const response: AxiosResponse = await authService.changePassword(
			currentPassword,
			newPassword,
		);
		res.status(StatusCodes.OK).json({ message: response.data.message });
	}
}
