import { PrismaClient } from "@/../generated/client";

import { config } from "@/lib/config";

const url = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}/${config.POSTGRES_DATABASE}?pgbouncer=true&connection_limit=10`;

export const db = new PrismaClient({
	datasources: {
		db: {
			url,
		},
	},
});
