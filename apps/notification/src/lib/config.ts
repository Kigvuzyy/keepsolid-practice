import { env } from "@/lib/env";

class Config {
	public readonly PORT: number;

	public readonly CLIENT_URL: string;

	public readonly RABBITMQ_ENDPOINT: string;

	public readonly SMTP_HOST: string;

	public readonly SMTP_PORT: number;

	public readonly SENDER_EMAIL: string;

	public readonly SENDER_EMAIL_PASSWORD: string;

	public readonly ELASTIC_SEARCH_URL: string;

	public constructor() {
		this.PORT = +env("PORT", "4001");
		this.CLIENT_URL = env("CLIENT_URL");
		this.RABBITMQ_ENDPOINT = env("RABBITMQ_ENDPOINT");
		this.SMTP_HOST = env("SMTP_HOST");
		this.SMTP_PORT = +env("SMTP_PORT");
		this.SENDER_EMAIL = env("SENDER_EMAIL");
		this.SENDER_EMAIL_PASSWORD = env("SENDER_EMAIL_PASSWORD");
		this.ELASTIC_SEARCH_URL = env("ELASTIC_SEARCH_URL");
	}
}

export const config: Config = new Config();
