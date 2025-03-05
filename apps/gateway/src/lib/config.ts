import { env } from "@/lib/env";

class Config {
	public readonly PORT: number;

	public readonly GATEWAY_JWT_TOKEN: string;

	public readonly JWT_TOKEN: string;

	public readonly SECRET_KEY_ONE: string;

	public readonly SECRET_KEY_TWO: string;

	public readonly CLIENT_URL: string;

	public readonly AUTH_BASE_URL: string;

	public readonly BOOKS_BASE_URL: string;

	public readonly ELASTIC_SEARCH_URL: string;

	public constructor() {
		this.PORT = +env("PORT", "4000");
		this.GATEWAY_JWT_TOKEN = env("GATEWAY_JWT_TOKEN");
		this.JWT_TOKEN = env("JWT_TOKEN");
		this.SECRET_KEY_ONE = env("SECRET_KEY_ONE");
		this.SECRET_KEY_TWO = env("SECRET_KEY_TWO");
		this.CLIENT_URL = env("CLIENT_URL");
		this.AUTH_BASE_URL = env("AUTH_BASE_URL");
		this.BOOKS_BASE_URL = env("BOOKS_BASE_URL");
		this.ELASTIC_SEARCH_URL = env("ELASTIC_SEARCH_URL");
	}
}

export const config: Config = new Config();
