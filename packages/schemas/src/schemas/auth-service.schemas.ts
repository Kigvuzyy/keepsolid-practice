import { z } from "zod";

import { usernameSchema, passwordSchema, emailSchema } from "@/schemas/common.schemas";

export const signinBodySchema = z.object({
	username: z.union([emailSchema, usernameSchema]),
	password: passwordSchema,
});

export const signupBodySchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
	email: emailSchema,
});

export const forgotPasswordBodySchema = z.object({
	email: emailSchema,
});

export const resetPasswordParamsSchema = z.object({
	token: z.string().min(20),
});

export const resetPasswordBodySchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string({
			required_error: "Confirm password is a required field",
			invalid_type_error: "Confirm password should be of type string",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords should match",
		path: ["confirmPassword"],
	});

export const changePasswordBodySchema = z
	.object({
		currentPassword: passwordSchema,
		newPassword: z.string({
			required_error: "New password is a required field",
			invalid_type_error: "New password should be of type string",
		}),
	})
	.refine((data) => data.currentPassword === data.newPassword, {
		message: "Passwords should match",
		path: ["newPassword"],
	});

export const verifyEmailBodySchema = z.object({
	token: z.string().min(20),
});

export const resendEmailBodySchema = z.object({
	email: z.string().email(),
	userId: z.number(),
});

export const refreshTokenParamsSchema = z.object({
	username: z.string().min(3, "Username should have at least 3 characters"),
});

export type ResendEmailBody = z.infer<typeof resendEmailBodySchema>;
export type RefreshTokenParams = z.infer<typeof refreshTokenParamsSchema>;
export type SignInBody = z.infer<typeof signinBodySchema>;
export type SignUpBody = z.infer<typeof signupBodySchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordParamsSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>;
export type VerifyEmailBody = z.infer<typeof verifyEmailBodySchema>;
