import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "@kigvuzyy/common";

import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { IVerifyEmailBody, IVerifyEmailResponse } from "@kigvuzyy/types";

import { omitUser } from "@/lib/util";
import { authService } from "@/services/auth.service";

export class VerifyEmailController {
	public async update(
		this: void,
		req: Request<ParamsDictionary, IVerifyEmailResponse, IVerifyEmailBody>,
		res: Response<IVerifyEmailResponse>,
	): Promise<void> {
		const { token } = req.body;

		const checkIfUserExists = await authService.getAuthUserByVerificationToken(token);

		if (!checkIfUserExists) {
			throw new BadRequestError(
				"Verification token is either invalid or is already used.",
				"VerifyEmail update() method error",
			);
		}

		const updatedUser = await authService.updateVerifyEmailField(
			checkIfUserExists.id,
			true,
			"",
		);

		res.status(StatusCodes.OK).json({
			message: "Email verified successfully",
			user: omitUser(updatedUser),
		});
	}
}
