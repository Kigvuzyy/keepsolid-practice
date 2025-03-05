import crypto from "node:crypto";

import { StatusCodes } from "http-status-codes";
import { BadRequestError, MailTemplates } from "@kigvuzyy/common";

import type { Buffer } from "node:buffer";
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

import { config } from "@/lib/config";
import { authService } from "@/services/auth.service";
import { sendNotification } from "@/queues/producers/notification.producer";

export class PasswordController {
	public async forgotPassword(
		this: void,
		req: Request<ParamsDictionary, IForgotPasswordResponse, IForgotPasswordBody>,
		res: Response<IForgotPasswordResponse>,
	): Promise<void> {
		const { email } = req.body;

		const existingUser = await authService.getUserByEmail(email);

		if (!existingUser) {
			throw new BadRequestError(
				"Invalid credentials. Email or username",
				"Password forgotPassword() method error",
			);
		}

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters: string = randomBytes.toString("hex");
		const date: Date = new Date();
		date.setHours(date.getHours() + 1);

		await authService.updatePasswordToken(existingUser.id, randomCharacters, date);

		const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;

		await sendNotification({
			username: existingUser.username,
			receiverEmail: existingUser.email,
			resetLink,
			template: MailTemplates.FORGOT_PASSWORD,
		});

		res.status(StatusCodes.OK).json({ message: "Password reset email sent." });
	}

	public async resetPassword(
		this: void,
		req: Request<IResetPasswordParams, IResetPasswordResponse, IResetPasswordBody>,
		res: Response<IResetPasswordResponse>,
	): Promise<void> {
		const { password, confirmPassword } = req.body;
		const { token } = req.params;

		if (password !== confirmPassword) {
			throw new BadRequestError(
				"Passwords do not match",
				"Password resetPassword() method error",
			);
		}

		const existingUser = await authService.getAuthUserByPasswordToken(token);

		if (!existingUser) {
			throw new BadRequestError(
				"Reset token has expired",
				"Password resetPassword() method error",
			);
		}

		await authService.updatePassword(existingUser.id, password);

		await sendNotification({
			username: existingUser.username,
			receiverEmail: existingUser.email,
			template: MailTemplates.RESET_PASSWORD_SUCCESS,
		});

		res.status(StatusCodes.OK).json({ message: "Password successfully reset." });
	}

	public async changePassword(
		this: void,
		req: Request<ParamsDictionary, IChangePasswordResponse, IChangePasswordBody>,
		res: Response<IChangePasswordResponse>,
	): Promise<void> {
		const { currentPassword, newPassword } = req.body;

		if (currentPassword !== newPassword) {
			throw new BadRequestError("Invalid password", "Password changePassword() method error");
		}

		const existingUser = req.currentUser
			? await authService.getUserByUsername(req.currentUser.username)
			: null;

		if (!existingUser) {
			throw new BadRequestError("Invalid password", "Password changePassword() method error");
		}

		await authService.updatePassword(existingUser.id, newPassword);

		await sendNotification({
			username: existingUser.username,
			receiverEmail: existingUser.email,
			template: MailTemplates.RESET_PASSWORD_SUCCESS,
		});

		res.status(StatusCodes.OK).json({ message: "Password successfully updated." });
	}
}
