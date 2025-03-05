import { createDirectPublisher } from "@kigvuzyy/brokers";
import { exchanges, routingKeys } from "@kigvuzyy/common";

import type { IAuthMailConsumedPayload } from "@kigvuzyy/types";

export const sendNotification = createDirectPublisher<IAuthMailConsumedPayload>(
	exchanges.notification.auth_mail,
	routingKeys.notification.auth_mail_routing_key,
	"Email was sent to notification service",
);
