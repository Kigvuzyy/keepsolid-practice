import { StatusCodes } from "http-status-codes";

import type { Request, Response } from "express";

export class HealthController {
	public health(this: void, _req: Request, res: Response): void {
		res.status(StatusCodes.OK).send("Auth service is healthy and OK.");
	}
}
