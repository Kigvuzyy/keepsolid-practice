import express from "express";

import type { Router } from "express";

import { SignUp } from "@/controllers/auth/signup";
import { SignIn } from "@/controllers/auth/signin";
import { Password } from "@/controllers/auth/password";
import { VerifyEmail } from "@/controllers/auth/verify-email";

class AuthRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post("/auth/signup", SignUp.prototype.create);
		this.router.post("/auth/signin", SignIn.prototype.read);
		this.router.put("/auth/verify-email", VerifyEmail.prototype.update);
		this.router.put("/auth/forgot-password", Password.prototype.forgotPassword);
		this.router.put("/auth/reset-password/:token", Password.prototype.resetPassword);
		this.router.put("/auth/change-password", Password.prototype.changePassword);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
