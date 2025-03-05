import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotAuthorizedError } from "@kigvuzyy/common";

import type { Request, Response } from "express";
import type { FavouriteParams } from "@kigvuzyy/schemas";
import type { IFavouriteResponse } from "@kigvuzyy/types";

import { favouritesService } from "@/services/favourites.service";

export class FavouritesController {
	public async addFavourite(
		this: void,
		req: Request<FavouriteParams, IFavouriteResponse>,
		res: Response<IFavouriteResponse>,
	): Promise<void> {
		const { id } = req.params;

		if (!req.currentUser) {
			throw new NotAuthorizedError("Invalid request", "Password addFavourite() method error");
		}

		const favouriteExists = await favouritesService.getFavourite(req.currentUser.id, id);

		if (favouriteExists) {
			throw new BadRequestError(
				"Book is already in your favourite list",
				"Password addFavourite() method error",
			);
		}

		await favouritesService.addFavourite(req.currentUser.id, id);

		res.status(StatusCodes.CREATED).json({
			message: "Book is added to favourite list successfully",
		});
	}

	public async removeFavourite(
		this: void,
		req: Request<FavouriteParams, IFavouriteResponse>,
		res: Response<IFavouriteResponse>,
	): Promise<void> {
		const { id } = req.params;

		if (!req.currentUser) {
			throw new NotAuthorizedError(
				"Invalid request",
				"Password removeFavourite() method error",
			);
		}

		const favouriteExists = await favouritesService.getFavourite(req.currentUser.id, id);

		if (!favouriteExists) {
			throw new BadRequestError(
				"Book is not in your favourite list",
				"Password addFavourite() method error",
			);
		}

		await favouritesService.removeFavourite(req.currentUser.id, id);

		res.status(StatusCodes.OK).json({
			message: "Book is removed from favourite list successfully",
		});
	}
}
