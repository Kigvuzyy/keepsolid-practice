import { StatusCodes } from "http-status-codes";
import { BadRequestError, isEmail } from "@kigvuzyy/common";

import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ISignInBody, ISignInGatewayResponse } from "@kigvuzyy/types";

import { db } from "@/lib/db";
import { omitUser } from "@/lib/util";
import { authService } from "@/services/auth.service";

export class SignInController {
	public async read(
		this: void,
		req: Request<ParamsDictionary, ISignInGatewayResponse, ISignInBody>,
		res: Response<ISignInGatewayResponse>,
	): Promise<void> {
		const { username, password } = req.body;
		const isValidEmail: boolean = isEmail(username);

		const existingUser = isValidEmail
			? await authService.getUserByEmail(username)
			: await authService.getUserByUsername(username);

		if (!existingUser) {
			throw new BadRequestError("Invalid credentials", "SignIn read() method error");
		}

		const isPasswordsMatch: boolean = await db.comparePassword(password, existingUser.password);

		if (!isPasswordsMatch) {
			throw new BadRequestError("Invalid credentials", "SignIn read() method error");
		}

		const userJwt = authService.signToken({
			id: existingUser.id,
			email: existingUser.email,
			username: existingUser.username,
			role: existingUser.role,
		});

		res.status(StatusCodes.OK).json({
			message: "User login successfully",
			user: omitUser(existingUser),
			token: userJwt,
		});
	}
}
