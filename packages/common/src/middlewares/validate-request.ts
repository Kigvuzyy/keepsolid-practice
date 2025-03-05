import { ZodError } from "zod";

import type { ZodTypeAny } from "zod";
import type { NextFunction, Request, Response, RequestHandler } from "express";

import { BadRequestError } from "@/utils/error.handler";

export const validateBody = (schema: ZodTypeAny): RequestHandler => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.body = await schema.parseAsync(req.body);

			next();
			return;
		} catch (err) {
			if (err instanceof ZodError) {
				throw new BadRequestError(err.message, "Schema body validation error");
			}

			next(err);
			return;
		}
	};
};

export const validateParams = <TParams>(schema: ZodTypeAny): RequestHandler<TParams> => {
	return async (req: Request<TParams>, _res: Response, next: NextFunction) => {
		try {
			req.params = await schema.parseAsync(req.params);

			next();
			return;
		} catch (err) {
			if (err instanceof ZodError) {
				throw new BadRequestError(err.message, "Schema params validation error");
			}

			next(err);
			return;
		}
	};
};

export const validateQuery = (schema: ZodTypeAny): RequestHandler => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.query = await schema.parseAsync(req.query);

			next();
			return;
		} catch (err) {
			if (err instanceof ZodError) {
				throw new BadRequestError(err.message, "Schema query validation error");
			}

			next(err);
			return;
		}
	};
};
