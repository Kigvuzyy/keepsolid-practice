import express from "express";
import { validateBody, validateParams, verifyAdmin } from "@kigvuzyy/common";

import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { CreateBookBody, DeleteBookParams, GetBookParams } from "@kigvuzyy/schemas";
import type { ICreateBookResponse, IDeleteBookResponse, IGetBookResponse } from "@kigvuzyy/types";

import { BooksController } from "@/controllers/books";
import {
	getBookParamsSchema,
	createBookBodySchema,
	deleteBookParamsSchema,
} from "@kigvuzyy/schemas";

class BooksRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get<GetBookParams, IGetBookResponse>(
			"/:id",
			validateParams(getBookParamsSchema),
			BooksController.prototype.findBookById,
		);
		this.router.post<ParamsDictionary, ICreateBookResponse, CreateBookBody>(
			"/",
			verifyAdmin,
			validateBody(createBookBodySchema),
			BooksController.prototype.createBook,
		);
		this.router.delete<DeleteBookParams, IDeleteBookResponse>(
			"/:id",
			verifyAdmin,
			validateParams(deleteBookParamsSchema),
			BooksController.prototype.deleteBookById,
		);

		return this.router;
	}
}

export const booksRoutes: BooksRoutes = new BooksRoutes();
