import type { Book } from "generated/client";
import type { ICreateBookBody } from "@kigvuzyy/types";

import { db } from "@/lib/db";
import { BOOKS_INDEX } from "@/lib/constants";
import { elasticsearchService } from "@/lib/elasticsearch";

type BookFull = Book & {
	authors: string[];
	genres: string[];
};

/**
 * Просто на будущее написано
 * У меня нет реализации маршрута на обновление
 */
type UpdateBookData = Partial<
	Pick<BookFull, "authors" | "description" | "genres" | "publicationDate" | "title" | "year">
>;

class BooksService {
	public async getBookById(bookId: number): Promise<Book | null> {
		return elasticsearchService.getDocument<Book>(BOOKS_INDEX, bookId.toString());
	}

	public async createBook(book: ICreateBookBody): Promise<Book> {
		const { title, publicationDate, year, description, authors, genres } = book;

		const createdBook = await db.book.create({
			data: {
				title,
				year,
				publicationDate,
				description,

				authors: {
					create: authors.map((author) => ({
						author: {
							connectOrCreate: {
								where: { name: author },
								create: { name: author },
							},
						},
					})),
				},

				genres: {
					create: genres.map((genre) => ({
						genre: {
							connectOrCreate: {
								where: { name: genre },
								create: { name: genre },
							},
						},
					})),
				},
			},

			include: {
				authors: { include: { author: true } },
				genres: { include: { genre: true } },
			},
		});

		await elasticsearchService.indexDocument<typeof createdBook>(
			BOOKS_INDEX,
			createdBook.id.toString(),
			createdBook,
		);

		return createdBook;
	}

	public async updateBookById(bookId: number, updatedData: UpdateBookData): Promise<Book> {
		const prismaUpdateData: any = {
			...(updatedData.title !== undefined && { title: updatedData.title }),
			...(updatedData.year !== undefined && { year: updatedData.year }),
			...(updatedData.publicationDate !== undefined && {
				publicationDate: updatedData.publicationDate,
			}),
			...(updatedData.description !== undefined && { description: updatedData.description }),
		};

		if (updatedData.authors !== undefined) {
			prismaUpdateData.authors = {
				deleteMany: {},
				create: updatedData.authors.map((authorName) => ({
					author: {
						connectOrCreate: {
							where: { name: authorName },
							create: { name: authorName },
						},
					},
				})),
			};
		}

		if (updatedData.genres !== undefined) {
			prismaUpdateData.genres = {
				deleteMany: {},
				create: updatedData.genres.map((genreName) => ({
					genre: {
						connectOrCreate: {
							where: { name: genreName },
							create: { name: genreName },
						},
					},
				})),
			};
		}

		const updatedBook = await db.book.update({
			where: { id: bookId },
			data: prismaUpdateData,
			include: {
				authors: { include: { author: true } },
				genres: { include: { genre: true } },
			},
		});

		await elasticsearchService.updateDocument<typeof updatedBook>(
			BOOKS_INDEX,
			updatedBook.id.toString(),
			updatedBook,
		);

		return updatedBook;
	}

	public async deleteBookById(bookId: number): Promise<Book> {
		const deletedBook = await db.book.delete({
			where: {
				id: bookId,
			},
		});

		await elasticsearchService.deleteDocument(BOOKS_INDEX, bookId.toString());

		return deletedBook;
	}
}

export const booksService: BooksService = new BooksService();
