import process from "node:process";

import { config } from "dotenv";

type ConfigKeys =
	| "CLIENT_URL"
	| "ELASTIC_SEARCH_URL"
	| "PORT"
	| "RABBITMQ_ENDPOINT"
	| "SENDER_EMAIL_PASSWORD"
	| "SENDER_EMAIL"
	| "SMTP_HOST"
	| "SMTP_PORT";

const file = process.env.NODE_ENV === "dev" ? ".env.local" : ".env";

const { parsed } = config({ path: file });

export const env = (key: ConfigKeys, defaultValue?: string): string => {
	const value = parsed?.[key] ?? process.env[key] ?? defaultValue;

	if (!value) {
		throw new Error(`Environment variable "${key}" is required but not defined.`);
	}

	return value;
};
