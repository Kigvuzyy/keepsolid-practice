import z from "zod";

export const getBookParamsSchema = z.object({
	id: z.coerce.number().nonnegative(),
});

export const createBookBodySchema = z.object({
	title: z.string(),
	year: z.number().nonnegative(),
	publicationDate: z.coerce.date(),
	description: z.string(),
	authors: z.array(z.string()).default([]),
	genres: z.array(z.string()).default([]),
});

export const deleteBookParamsSchema = z.object({
	id: z.coerce.number().nonnegative(),
});

export const favouriteParamsSchema = z.object({
	id: z.coerce.number().nonnegative(),
});

export type GetBookParams = z.infer<typeof getBookParamsSchema>;
export type CreateBookBody = z.infer<typeof createBookBodySchema>;
export type DeleteBookParams = z.infer<typeof deleteBookParamsSchema>;
export type FavouriteParams = z.infer<typeof favouriteParamsSchema>;
