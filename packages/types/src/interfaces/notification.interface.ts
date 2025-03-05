import type { MailTemplates } from "@kigvuzyy/common";

export interface IAuthMailConsumedPayload {
	receiverEmail: string;
	resetLink?: string;
	template: MailTemplates;
	username: string;
	verifyLink?: string;
}
