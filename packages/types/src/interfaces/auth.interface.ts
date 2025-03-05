/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Role } from "@kigvuzyy/common";
import type { IBaseResponse } from "@/interfaces/common";

export interface IAuthOmittedUser {
	id: number;
	username: string;
	email: string;
	emailVerified: boolean;
	role: keyof typeof Role;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICurrentUserResponse extends IBaseResponse {
	user: IAuthOmittedUser | null;
}

export interface ISignInBody {
	password: string;
	username: string;
}

export interface ISignInResponse extends IBaseResponse {
	user: IAuthOmittedUser;
}

export interface ISignInGatewayResponse extends ISignInResponse {
	token: string;
}

export interface ISignUpBody {
	email: string;
	password: string;
	username: string;
}

export interface ISignUpResponse extends IBaseResponse {
	user: IAuthOmittedUser;
}

export interface ISignUpGatewayResponse extends ISignUpResponse {
	token: string;
}

export interface IForgotPasswordBody {
	email: string;
}

export interface IForgotPasswordResponse extends IBaseResponse {}

export interface IResetPasswordParams {
	token: string;
}

export interface IResetPasswordBody {
	confirmPassword: string;
	password: string;
}

export interface IResetPasswordResponse extends IBaseResponse {}

export interface IChangePasswordBody {
	currentPassword: string;
	newPassword: string;
}

export interface IChangePasswordResponse extends IBaseResponse {}

export interface IVerifyEmailBody {
	token: string;
}

export interface IVerifyEmailResponse extends IBaseResponse {
	user: IAuthOmittedUser;
}

export interface IResendEmailBody {
	email: string;
	userId: number;
}

export interface IResendEmailResponse extends IBaseResponse {
	user: IAuthOmittedUser;
}

export interface IRefreshTokenParams {
	username: string;
}

export interface IRefreshTokenResponse extends IBaseResponse {
	user: IAuthOmittedUser;
}

export interface IRefreshTokenGatewayResponse extends IRefreshTokenResponse {
	token: string;
}
