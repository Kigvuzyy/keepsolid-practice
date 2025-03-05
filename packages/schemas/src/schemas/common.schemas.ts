import z from "zod";

export const emailSchema = z
	.string({
		required_error: "Email is a required field",
		invalid_type_error: "Email must be of type string",
	})
	.email({ message: "Invalid email" });

export const usernameSchema = z
	.string({
		required_error: "Username is a required field",
		invalid_type_error: "Username must be of type string",
	})
	.min(4, { message: "Invalid username" })
	.max(12, { message: "Invalid username" });

export const passwordSchema = z
	.string({
		required_error: "Password is a required field",
		invalid_type_error: "Password must be of type string",
	})
	.min(8, { message: "Invalid password" })
	.max(24, { message: "Invalid password" });
