import process from "node:process";

import jwt from "jsonwebtoken";

import type { Request, Response, NextFunction, RequestHandler } from "express";

import { VALID_GATEWAY_IDS } from "@/utils/constants";
import { NotAuthorizedError } from "@/utils/error.handler";

interface GatewayTokenPayload {
	iat: number;
	id: string;
}

export const verifyGatewayRequest = (): RequestHandler => {
	const jwtGatewaySecret = process.env.GATEWAY_JWT_TOKEN;

	if (!jwtGatewaySecret) {
		throw new Error("GATEWAY_JWT_TOKEN is not defined in environment variables.");
	}

	return (req: Request, _res: Response, next: NextFunction) => {
		const token = req.headers?.gatewaytoken as string | undefined;

		if (!token) {
			throw new NotAuthorizedError(
				"Invalid request",
				"verifyGatewayRequest(): gatewaytoken header is missing",
			);
		}

		try {
			const payload = jwt.verify(token, jwtGatewaySecret) as GatewayTokenPayload;

			if (!VALID_GATEWAY_IDS.includes(payload.id)) {
				throw new NotAuthorizedError(
					"Invalid request",
					`verifyGatewayRequest(): unknown payload id - ${payload.id}`,
				);
			}
		} catch (error) {
			throw new NotAuthorizedError(
				"Invalid request",
				"verifyGatewayRequest(): failed to verify JWT",
			);
		}

		next();
	};
};
