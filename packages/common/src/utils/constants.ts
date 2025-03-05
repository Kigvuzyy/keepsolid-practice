export const VALID_GATEWAY_IDS: string[] = ["auth", "books", "notification"];

export const exchanges = {
	notification: {
		auth_mail: "ks.email.notification",
	},
};

export const queues = {
	notification: {
		auth_mail_queue: "auth.email",
	},
};

export const routingKeys = {
	notification: {
		auth_mail_routing_key: "auth.email.queue",
	},
};

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
}

export enum MailTemplates {
	FORGOT_PASSWORD = "forgotPassword",
	RESET_PASSWORD_SUCCESS = "resetPasswordSuccess",
	VERIFY_EMAIL = "verifyEmail",
}
