/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable typescript-sort-keys/interface */
import type { IBaseResponse } from "@/interfaces/common";

export interface IBook {
	id: number;
	title: string;
	year: number;
	publicationDate: Date;
	description: string;
}

export interface IGetBookParams {
	id: string;
}

export interface IGetBookResponse extends IBaseResponse {
	book: IBook;
}

export interface ICreateBookBody {
	title: string;
	description: string;
	year: number;
	publicationDate: Date;
	authors: string[];
	genres: string[];
}

export interface ICreateBookResponse extends IBaseResponse {
	book: IBook;
}

export interface IDeleteBookParams {
	id: string;
}

export interface IDeleteBookResponse extends IBaseResponse {
	book: IBook;
}

export interface IFavouriteParams {
	id: string;
}

export interface IFavouriteResponse extends IBaseResponse {}
