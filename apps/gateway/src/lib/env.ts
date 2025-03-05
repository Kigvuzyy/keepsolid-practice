import process from "node:process";

import { config } from "dotenv";

type ConfigKeys =
	| "AUTH_BASE_URL"
	| "BOOKS_BASE_URL"
	| "CLIENT_URL"
	| "ELASTIC_SEARCH_URL"
	| "GATEWAY_JWT_TOKEN"
	| "JWT_TOKEN"
	| "PORT"
	| "SECRET_KEY_ONE"
	| "SECRET_KEY_TWO";

const file = process.env.NODE_ENV === "dev" ? ".env.local" : ".env";

const { parsed } = config({ path: file });

export const env = (key: ConfigKeys, defaultValue?: string): string => {
	const value = parsed?.[key] ?? process.env[key] ?? defaultValue;

	if (!value) {
		throw new Error(`Environment variable "${key}" is required but not defined.`);
	}

	return value;
};
