import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { IFavouriteParams, IFavouriteResponse } from "@kigvuzyy/types";

import { bookService } from "@/services/api/book.service";

export class Favourites {
	public async addFavourite(
		this: void,
		req: Request<IFavouriteParams, IFavouriteResponse>,
		res: Response<IFavouriteResponse>,
	): Promise<void> {
		const response: AxiosResponse = await bookService.addFavourite(req.params.id);
		res.status(StatusCodes.CREATED).json({
			message: response.data.message,
		});
	}

	public async removeFavourite(
		this: void,
		req: Request<IFavouriteParams, IFavouriteResponse>,
		res: Response<IFavouriteResponse>,
	): Promise<void> {
		const response: AxiosResponse = await bookService.removeFavourite(req.params.id);
		res.status(StatusCodes.OK).json({
			message: response.data.message,
		});
	}
}
