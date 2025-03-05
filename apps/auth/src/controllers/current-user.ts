import crypto from "node:crypto";

import { StatusCodes } from "http-status-codes";
import { BadRequestError, lowerCase, MailTemplates } from "@kigvuzyy/common";

import type { Buffer } from "node:buffer";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ICurrentUserResponse, IResendEmailBody, IResendEmailResponse } from "@kigvuzyy/types";

import { config } from "@/lib/config";
import { omitUser } from "@/lib/util";
import { authService } from "@/services/auth.service";
import { sendNotification } from "@/queues/producers/notification.producer";

export class CurrentUserController {
	public async read(
		this: void,
		req: Request<ParamsDictionary, ICurrentUserResponse>,
		res: Response<ICurrentUserResponse>,
	): Promise<void> {
		const user = req.currentUser ? await authService.getAuthUserById(req.currentUser.id) : null;

		res.status(StatusCodes.OK).send({
			message: "Authenticated user",
			user: user && omitUser(user),
		});
	}

	public async resendEmail(
		this: void,
		req: Request<ParamsDictionary, IResendEmailResponse, IResendEmailBody>,
		res: Response<IResendEmailResponse>,
	): Promise<void> {
		const { email, userId } = req.body;

		const checkIfUserExists = await authService.getUserByEmail(lowerCase(email));

		if (!checkIfUserExists) {
			throw new BadRequestError("Email is invalid", "CurrentUser resendEmail() method error");
		}

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters: string = randomBytes.toString("hex");

		const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

		const updatedUser = await authService.updateVerifyEmailField(
			userId,
			false,
			verificationLink,
		);

		await sendNotification({
			username: updatedUser.username,
			receiverEmail: updatedUser.email,
			verifyLink: verificationLink,
			template: MailTemplates.VERIFY_EMAIL,
		});

		res.status(StatusCodes.OK).json({
			message: "Email verification sent",
			user: omitUser(updatedUser),
		});
	}
}
