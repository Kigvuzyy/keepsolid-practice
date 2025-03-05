import { sign } from "jsonwebtoken";
import { firstLetterUppercase, lowerCase } from "@kigvuzyy/common";

import type { SignOptions } from "jsonwebtoken";
import type { Auth, Role } from "generated/client";

import { db } from "@/lib/db";
import { config } from "@/lib/config";

class AuthService {
	private readonly jwtOptions: SignOptions = {
		algorithm: "HS256",
		expiresIn: "1h",
		issuer: "keepsolid-library",
		audience: "books.com",
	};

	public async createAuthUser(
		data: Pick<Auth, "email" | "emailVerificationToken" | "password" | "username">,
	): Promise<Auth> {
		return db.auth.create({
			data,
		});
	}

	public async getAuthUserById(authId: number): Promise<Auth | null> {
		return db.auth.findUnique({
			where: {
				id: authId,
			},
		});
	}

	public async getAuthUserByUsernameOrEmail(
		username: string,
		email: string,
	): Promise<Auth | null> {
		return db.auth.findFirst({
			where: {
				OR: [{ username: firstLetterUppercase(username) }, { email: lowerCase(email) }],
			},
		});
	}

	public async getUserByUsername(username: string): Promise<Auth | null> {
		return db.auth.findUnique({
			where: {
				username: firstLetterUppercase(username),
			},
		});
	}

	public async getUserByEmail(email: string): Promise<Auth | null> {
		return db.auth.findUnique({
			where: {
				email: lowerCase(email),
			},
		});
	}

	public async getAuthUserByVerificationToken(token: string): Promise<Auth | null> {
		return db.auth.findFirst({
			where: {
				emailVerificationToken: token,
			},
		});
	}

	public async getAuthUserByPasswordToken(token: string): Promise<Auth | null> {
		return db.auth.findFirst({
			where: {
				AND: [{ passwordResetToken: token }, { passwordResetExpires: { gt: new Date() } }],
			},
		});
	}

	public async updateVerifyEmailField(
		authId: number,
		emailVerified: boolean,
		emailVerificationToken: string,
	): Promise<Auth> {
		return db.auth.update({
			where: {
				id: authId,
			},
			data: {
				emailVerified,
				emailVerificationToken,
			},
		});
	}

	public async updatePasswordToken(
		authId: number,
		token: string,
		tokenExpiration: Date,
	): Promise<Auth> {
		return db.auth.update({
			where: {
				id: authId,
			},
			data: {
				passwordResetToken: token,
				passwordResetExpires: tokenExpiration,
			},
		});
	}

	public async updatePassword(authId: number, password: string): Promise<Auth> {
		return db.auth.update({
			where: {
				id: authId,
			},
			data: {
				password,
				passwordResetToken: "",
				passwordResetExpires: new Date(),
			},
		});
	}

	public signToken({
		id,
		email,
		username,
		role,
	}: {
		email: string;
		id: number;
		role: Role;
		username: string;
	}): string {
		return sign(
			{
				id,
				email,
				username,
				role,
			},
			config.JWT_TOKEN,
			{
				...this.jwtOptions,
				subject: id.toString(),
			},
		);
	}
}

export const authService: AuthService = new AuthService();
