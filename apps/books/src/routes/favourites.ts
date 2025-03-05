import express from "express";

import type { Router } from "express";
import type { FavouriteParams } from "@kigvuzyy/schemas";
import type { IFavouriteResponse } from "@kigvuzyy/types";

import { validateParams } from "@kigvuzyy/common";
import { favouriteParamsSchema } from "@kigvuzyy/schemas";
import { FavouritesController } from "@/controllers/favourites";

class FavouritesRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post<FavouriteParams, IFavouriteResponse>(
			"/:id/favourite",
			validateParams(favouriteParamsSchema),
			FavouritesController.prototype.addFavourite,
		);
		this.router.delete<FavouriteParams, IFavouriteResponse>(
			"/:id/favourite",
			validateParams(favouriteParamsSchema),
			FavouritesController.prototype.removeFavourite,
		);

		return this.router;
	}
}

export const favouritesRoutes: FavouritesRoutes = new FavouritesRoutes();
