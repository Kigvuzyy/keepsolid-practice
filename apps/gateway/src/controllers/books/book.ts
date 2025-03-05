import { StatusCodes } from "http-status-codes";

import type { AxiosResponse } from "axios";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type {
	ICreateBookBody,
	ICreateBookResponse,
	IDeleteBookParams,
	IDeleteBookResponse,
	IGetBookParams,
	IGetBookResponse,
} from "@kigvuzyy/types";

import { bookService } from "@/services/api/book.service";

export class Book {
	public async findBookById(
		this: void,
		req: Request<IGetBookParams, IGetBookResponse>,
		res: Response<IGetBookResponse>,
	): Promise<void> {
		const response: AxiosResponse = await bookService.findBookById(req.params.id);
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			book: response.data.book,
		});
	}

	public async createBook(
		this: void,
		req: Request<ParamsDictionary, ICreateBookResponse, ICreateBookBody>,
		res: Response<ICreateBookResponse>,
	): Promise<void> {
		const response: AxiosResponse = await bookService.createBook(req.body);
		res.status(StatusCodes.CREATED).json({
			message: response.data.message,
			book: response.data.book,
		});
	}

	public async deleteBookById(
		this: void,
		req: Request<IDeleteBookParams, IDeleteBookResponse>,
		res: Response<IDeleteBookResponse>,
	): Promise<void> {
		const response: AxiosResponse = await bookService.deleteBookById(req.params.id);
		res.status(StatusCodes.OK).json({
			message: response.data.message,
			book: response.data.book,
		});
	}
}
