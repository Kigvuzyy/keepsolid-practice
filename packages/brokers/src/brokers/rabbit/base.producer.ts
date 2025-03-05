import type { BaseBrokerOptions } from "@/brokers/broker";

import { getRabbitChannel } from "@/brokers/rabbit/connection";
import { DefaultBrokerOptions, ExchangeType } from "@/brokers/broker";

export interface BasePublisherOptions extends BaseBrokerOptions {
	readonly durable?: boolean;
}

export const DefaultPublisherOptions = {
	...DefaultBrokerOptions,
	durable: true,
} as const satisfies Required<BasePublisherOptions>;

export const createDirectPublisher = <TData>(
	exchange: string,
	routingKey: string,
	logMessage: string,
	options?: BasePublisherOptions,
): ((data: TData) => Promise<void>) => {
	const publisherOptions = {
		...DefaultPublisherOptions,
		...options,
	};

	return async (data: TData) => {
		const channel = getRabbitChannel();
		await channel.assertExchange(exchange, ExchangeType.DIRECT, {
			durable: publisherOptions.durable,
		});
		console.log(logMessage, data);
		const encoded = publisherOptions.encode(data);
		channel.publish(exchange, routingKey, encoded);
	};
};
