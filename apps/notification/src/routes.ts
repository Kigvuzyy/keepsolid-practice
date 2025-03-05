import { StatusCodes } from "http-status-codes";

import type { Application, Request, Response } from "express";

class AppRoutes {
	public routes(app: Application): void {
		app.use("/notification-health", (_req: Request, res: Response) => {
			res.status(StatusCodes.OK).send("Notification service is healthy and OK.");
		});
	}
}

export const appRoutes: AppRoutes = new AppRoutes();
