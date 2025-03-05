import type axios from "axios";
import type { AxiosResponse } from "axios";
import type { ICreateBookBody } from "@kigvuzyy/types";

import { config } from "@/lib/config";
import { AxiosService } from "@/services/axios";

export let axiosBookInstance: ReturnType<typeof axios.create>;

class BookService {
	public readonly axiosService: AxiosService;

	public constructor() {
		this.axiosService = new AxiosService(`${config.BOOKS_BASE_URL}/api/v1/books`, "books");
		axiosBookInstance = this.axiosService.axios;
	}

	public async createBook(body: ICreateBookBody): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosBookInstance.post("/", body);
		return response;
	}

	public async addFavourite(id: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosBookInstance.post(`/${id}/favourite`);
		return response;
	}

	public async removeFavourite(id: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosBookInstance.delete(`/${id}/favourite`);
		return response;
	}

	public async deleteBookById(id: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosBookInstance.delete(`/${id}`);
		return response;
	}

	public async findBookById(id: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await this.axiosService.axios.get(`/${id}`);
		return response;
	}
}

export const bookService: BookService = new BookService();
