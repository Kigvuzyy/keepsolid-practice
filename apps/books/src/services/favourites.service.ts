import type { Favourites } from "generated/client";

import { db } from "@/lib/db";

class FavouritesService {
	public async getFavourite(userId: number, bookId: number): Promise<Favourites | null> {
		return db.favourites.findUnique({
			where: {
				userId_bookId: {
					userId,
					bookId,
				},
			},
		});
	}

	public async addFavourite(userId: number, bookId: number): Promise<Favourites> {
		return db.favourites.create({
			data: {
				userId,
				bookId,
			},
		});
	}

	public async removeFavourite(userId: number, bookId: number): Promise<Favourites> {
		return db.favourites.delete({
			where: {
				userId_bookId: {
					userId,
					bookId,
				},
			},
		});
	}
}

export const favouritesService: FavouritesService = new FavouritesService();
