import { StatusCodes } from "http-status-codes";
import { NotAuthorizedError, NotFoundError } from "@kigvuzyy/common";

import type { Request, Response } from "express";
import type { DeleteBookParams, GetBookParams } from "@kigvuzyy/schemas";
import type { ParamsDictionary } from "express-serve-static-core";
import type {
	ICreateBookBody,
	ICreateBookResponse,
	IDeleteBookResponse,
	IGetBookResponse,
} from "@kigvuzyy/types";

import { booksService } from "@/services/books.service";

export class BooksController {
	public async findBookById(
		this: void,
		req: Request<GetBookParams, IGetBookResponse>,
		res: Response<IGetBookResponse>,
	): Promise<void> {
		const { id } = req.params;

		const book = await booksService.getBookById(id);

		if (!book) {
			throw new NotFoundError(
				"Book is not found",
				"BooksController findBookById method() error",
			);
		}

		res.status(StatusCodes.OK).json({ message: "Get book by id", book });
	}

	public async createBook(
		this: void,
		req: Request<ParamsDictionary, ICreateBookResponse, ICreateBookBody>,
		res: Response<ICreateBookResponse>,
	): Promise<void> {
		if (!req.currentUser) {
			throw new NotAuthorizedError(
				"Invalid request",
				"BooksController createBook() method error",
			);
		}

		const createdBook = await booksService.createBook(req.body);

		res.status(StatusCodes.CREATED).json({
			message: "Book created successfully",
			book: createdBook,
		});
	}

	public async deleteBookById(
		this: void,
		req: Request<DeleteBookParams, IDeleteBookResponse>,
		res: Response<IDeleteBookResponse>,
	): Promise<void> {
		if (!req.currentUser) {
			throw new NotAuthorizedError(
				"Invalid request",
				"BooksController deleteBook() method error",
			);
		}

		const book = await booksService.getBookById(req.params.id);

		if (!book) {
			throw new NotFoundError(
				"Book is not found",
				"BooksController deleteBook method() error",
			);
		}

		const deletedBook = await booksService.deleteBookById(book.id);

		res.status(StatusCodes.OK).json({
			message: "Book deleted successfully",
			book: deletedBook,
		});
	}
}
