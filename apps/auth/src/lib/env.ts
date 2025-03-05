import process from "node:process";

import { config } from "dotenv";

type ConfigKeys =
	| "API_GATEWAY_URL"
	| "CLIENT_URL"
	| "ELASTIC_SEARCH_URL"
	| "GATEWAY_JWT_TOKEN"
	| "JWT_TOKEN"
	| "PORT"
	| "POSTGRES_DATABASE"
	| "POSTGRES_HOST"
	| "POSTGRES_PASSWORD"
	| "POSTGRES_USER"
	| "RABBITMQ_ENDPOINT";

const file = process.env.NODE_ENV === "dev" ? ".env.local" : ".env";

const { parsed } = config({ path: file });

export const env = (key: ConfigKeys, defaultValue?: string): string => {
	const value = parsed?.[key] ?? process.env[key] ?? defaultValue;

	if (!value) {
		throw new Error(`Environment variable "${key}" is required but not defined.`);
	}

	return value;
};
