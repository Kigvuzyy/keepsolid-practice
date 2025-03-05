import express from "express";
import { validateBody, validateParams } from "@kigvuzyy/common";
import {
	changePasswordBodySchema,
	forgotPasswordBodySchema,
	resetPasswordBodySchema,
	resetPasswordParamsSchema,
	signinBodySchema,
	signupBodySchema,
	verifyEmailBodySchema,
} from "@kigvuzyy/schemas";

import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type {
	IChangePasswordResponse,
	IForgotPasswordResponse,
	IResetPasswordResponse,
	IVerifyEmailResponse,
	ISignInGatewayResponse,
	ISignUpGatewayResponse,
} from "@kigvuzyy/types";
import type {
	ChangePasswordBody,
	ForgotPasswordBody,
	ResetPasswordBody,
	ResetPasswordParams,
	SignInBody,
	SignUpBody,
	VerifyEmailBody,
} from "@kigvuzyy/schemas";

import { SignUpController } from "@/controllers/signup";
import { SignInController } from "@/controllers/signin";
import { PasswordController } from "@/controllers/password";
import { VerifyEmailController } from "@/controllers/verify-email";

class AuthRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post<ParamsDictionary, ISignUpGatewayResponse, SignUpBody>(
			"/signup",
			validateBody(signupBodySchema),
			SignUpController.prototype.create,
		);
		this.router.post<ParamsDictionary, ISignInGatewayResponse, SignInBody>(
			"/signin",
			validateBody(signinBodySchema),
			SignInController.prototype.read,
		);
		this.router.put<ParamsDictionary, IVerifyEmailResponse, VerifyEmailBody>(
			"/verify-email",
			validateBody(verifyEmailBodySchema),
			VerifyEmailController.prototype.update,
		);
		this.router.put<ParamsDictionary, IForgotPasswordResponse, ForgotPasswordBody>(
			"/forgot-password",
			validateBody(forgotPasswordBodySchema),
			PasswordController.prototype.forgotPassword,
		);
		this.router.put<ResetPasswordParams, IResetPasswordResponse, ResetPasswordBody>(
			"/reset-password/:token",
			validateParams(resetPasswordParamsSchema),
			validateBody(resetPasswordBodySchema),
			PasswordController.prototype.resetPassword,
		);
		this.router.put<ParamsDictionary, IChangePasswordResponse, ChangePasswordBody>(
			"/change-password",
			validateBody(changePasswordBodySchema),
			PasswordController.prototype.changePassword,
		);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
