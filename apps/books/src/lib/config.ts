import { env } from "@/lib/env";

class Config {
	public readonly PORT: number;

	public readonly GATEWAY_JWT_TOKEN: string;

	public readonly JWT_TOKEN: string;

	public readonly API_GATEWAY_URL: string;

	public readonly CLIENT_URL: string;

	public readonly POSTGRES_USER: string;

	public readonly POSTGRES_PASSWORD: string;

	public readonly POSTGRES_HOST: string;

	public readonly POSTGRES_DATABASE: string;

	public readonly ELASTIC_SEARCH_URL: string;

	public constructor() {
		this.PORT = +env("PORT", "4003");
		this.GATEWAY_JWT_TOKEN = env("GATEWAY_JWT_TOKEN");
		this.JWT_TOKEN = env("JWT_TOKEN");
		this.API_GATEWAY_URL = env("API_GATEWAY_URL");
		this.CLIENT_URL = env("CLIENT_URL");
		this.POSTGRES_USER = env("POSTGRES_USER");
		this.POSTGRES_PASSWORD = env("POSTGRES_PASSWORD");
		this.POSTGRES_HOST = env("POSTGRES_HOST");
		this.POSTGRES_DATABASE = env("POSTGRES_DATABASE");
		this.ELASTIC_SEARCH_URL = env("ELASTIC_SEARCH_URL");
	}
}

export const config: Config = new Config();
