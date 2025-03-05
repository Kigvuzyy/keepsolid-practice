import process from "node:process";

import jwt from "jsonwebtoken";

import type { IAuthPayload } from "@/types/auth-payload";
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const currentUser = (): RequestHandler => {
	const jwtSecret = process.env.JWT_TOKEN;

	if (!jwtSecret) {
		throw new Error("JWT_TOKEN is not defined in environment variables.");
	}

	return (req: Request, _res: Response, next: NextFunction) => {
		const authorizationHeader = req.headers.authorization;

		if (authorizationHeader) {
			const [bearer, token] = authorizationHeader.split(" ");

			if (bearer && bearer.toLowerCase() === "bearer" && token) {
				try {
					const payload = jwt.verify(token, jwtSecret) as IAuthPayload;
					req.currentUser = payload;
				} catch {}
			}
		}

		next();
	};
};
