import express from "express";

import type { Router } from "express";

import { Book } from "@/controllers/books/book";
import { Favourites } from "@/controllers/books/favourites";
import { authMiddleware } from "@/middlewares/auth";

class BookRoutes {
	private readonly router: Router;

	public constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get("/books/:id", Book.prototype.findBookById);
		this.router.post("/books", authMiddleware.verifyUser, Book.prototype.createBook);
		this.router.post(
			"/books/:id/favourite",
			authMiddleware.verifyUser,
			Favourites.prototype.addFavourite,
		);
		this.router.delete(
			"/books/:id/favourite",
			authMiddleware.verifyUser,
			Favourites.prototype.removeFavourite,
		);
		this.router.delete("/books/:id", authMiddleware.verifyUser, Book.prototype.deleteBookById);

		return this.router;
	}
}

export const bookRoutes: BookRoutes = new BookRoutes();
