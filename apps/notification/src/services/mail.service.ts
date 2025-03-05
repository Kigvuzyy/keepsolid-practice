import path from "node:path";
import process from "node:process";

import Email from "email-templates";
import nodemailer from "nodemailer";
import { winstonLogger } from "@kigvuzyy/common";

import type { Logger } from "winston";
import type { Transporter } from "nodemailer";
import type { MailTemplates } from "@kigvuzyy/common";

import { config } from "@/lib/config";

const logger: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "mailTransport", "debug");

interface IEmailLocals {
	appIcon: string;
	appLink: string;
	resetLink: string | undefined;
	username: string;
	verifyLink: string | undefined;
}

class MailService {
	public async sendEmail(
		template: MailTemplates,
		receiver: string,
		locals: IEmailLocals,
	): Promise<void> {
		try {
			const smtpTransport: Transporter = nodemailer.createTransport({
				host: config.SMTP_HOST,
				port: config.SMTP_PORT,
				auth: {
					user: config.SENDER_EMAIL,
					pass: config.SENDER_EMAIL_PASSWORD,
				},
			});

			const email: Email = new Email({
				message: {
					from: `KeepSolid Library <${config.SENDER_EMAIL}>`,
				},
				send: true,
				preview: false,
				transport: smtpTransport,
				views: {
					options: {
						extension: "ejs",
					},
				},
				juice: true,
				juiceResources: {
					preserveImportant: true,
					webResources: {
						relativeTo: path.join(__dirname, "."),
					},
				},
			});

			const templatePath = path.join(
				__dirname,
				process.env.NODE_ENV === "dev" ? "../../templates" : "../templates",
				template,
			);

			await email.send({
				template: templatePath,
				message: {
					to: receiver,
				},
				locals,
			});

			logger.info("Email sent successfully.");
		} catch (error) {
			logger.log("error", "NotificationService MailService sendEmail() method error:", error);
		}
	}
}

export const mailService: MailService = new MailService();
