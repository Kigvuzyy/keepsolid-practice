import z from "zod";
import { BaseConsumer } from "@kigvuzyy/brokers";
import { emailSchema, usernameSchema } from "@kigvuzyy/schemas";
import { MailTemplates, exchanges, queues, routingKeys } from "@kigvuzyy/common";

import type { Channel, Connection } from "amqplib";

import { config } from "@/lib/config";
import { mailService } from "@/services/mail.service";

export const authMailConsumedSchema = z.object({
	username: usernameSchema,
	receiverEmail: emailSchema,
	template: z.nativeEnum(MailTemplates),
	verifyLink: z.string().optional(),
	resetLink: z.string().optional(),
});

export type AuthMailConsumed = z.infer<typeof authMailConsumedSchema>;

export class AuthMailConsumer extends BaseConsumer<AuthMailConsumed> {
	public constructor(channel: Channel, connection: Connection) {
		super({
			channel,
			connection,
			exchangeName: exchanges.notification.auth_mail,
			queueName: queues.notification.auth_mail_queue,
			routingKey: routingKeys.notification.auth_mail_routing_key,
			schema: authMailConsumedSchema,
		});
	}

	protected override async handleMessage(data: AuthMailConsumed): Promise<void> {
		const { username, receiverEmail, verifyLink, resetLink, template } = data;

		const locals = {
			appLink: config.CLIENT_URL,
			appIcon: "https://i.imgur.com/ovvSadB.jpeg",
			username,
			verifyLink,
			resetLink,
		};

		this.emit("info", JSON.stringify(locals));

		await mailService.sendEmail(template, receiverEmail, locals);
	}
}
