import bcrypt from "bcrypt";
import { PrismaClient } from "@/../generated/client";

import { config } from "@/lib/config";

const SALT_ROUND = 10;

const url = `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}/${config.POSTGRES_DATABASE}?pgbouncer=true&connection_limit=10`;

export const db = new PrismaClient({
	datasources: {
		db: {
			url,
		},
	},
}).$extends({
	name: "passwordExtension",

	client: {
		async comparePassword(plain: string, hashed: string) {
			return bcrypt.compare(plain, hashed);
		},

		async hashPassword(plain: string) {
			return bcrypt.hash(plain, SALT_ROUND);
		},
	},

	query: {
		auth: {
			async $allOperations({ operation, args, query }) {
				if (operation === "create") {
					if (args.data.password) {
						args.data.password = await db.hashPassword(args.data.password);
					}

					return query(args);
				} else if (operation === "update") {
					const pass = args.data?.password;

					if (typeof pass === "string") {
						args.data.password = await db.hashPassword(pass);
					} else if (
						pass &&
						typeof pass === "object" &&
						"set" in pass &&
						typeof pass.set === "string"
					) {
						pass.set = await db.hashPassword(pass.set);
					}

					return query(args);
				}

				return query(args);
			},
		},
	},
});
