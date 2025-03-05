import crypto from "node:crypto";

import { StatusCodes } from "http-status-codes";
import { BadRequestError, firstLetterUppercase, lowerCase, MailTemplates } from "@kigvuzyy/common";

import type { Buffer } from "node:buffer";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ISignUpBody, ISignUpGatewayResponse } from "@kigvuzyy/types";

import { config } from "@/lib/config";
import { omitUser } from "@/lib/util";
import { authService } from "@/services/auth.service";
import { sendNotification } from "@/queues/producers/notification.producer";

export class SignUpController {
	public async create(
		this: void,
		req: Request<ParamsDictionary, ISignUpGatewayResponse, ISignUpBody>,
		res: Response<ISignUpGatewayResponse>,
	): Promise<void> {
		const { username, email, password } = req.body;

		const checkIfUserExists = await authService.getAuthUserByUsernameOrEmail(username, email);

		if (checkIfUserExists) {
			throw new BadRequestError(
				"Invalid credentials. User is already registered",
				"SignUp create() method error",
			);
		}

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters: string = randomBytes.toString("hex");

		const user = await authService.createAuthUser({
			username: firstLetterUppercase(username),
			email: lowerCase(email),
			password,
			emailVerificationToken: randomCharacters,
		});

		const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${user.emailVerificationToken}`;

		await sendNotification({
			username: user.username,
			receiverEmail: user.email,
			verifyLink: verificationLink,
			template: MailTemplates.VERIFY_EMAIL,
		});

		const userJwt = authService.signToken({
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role,
		});

		res.status(StatusCodes.CREATED).json({
			message: "User created successfully",
			user: omitUser(user),
			token: userJwt,
		});
	}
}
