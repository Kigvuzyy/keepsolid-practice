import { Role } from "@/utils/constants";
import { ForbiddenError } from "@/utils/error.handler";

import type { Request, Response, NextFunction } from "express";

export const verifyAdmin = (req: Request<unknown>, _res: Response, next: NextFunction): void => {
	if (req.currentUser?.role !== Role.ADMIN) {
		throw new ForbiddenError("Invalid request", "verifyAdmin(): permission denied");
	}

	next();
};
