import { AsyncEventEmitter } from "@vladfrangu/async_event_emitter";

import type { ZodType } from "zod";
import type { Connection, Channel, ConsumeMessage } from "amqplib";
import type { IBaseBroker, BaseBrokerOptions } from "@/brokers/broker";

import { DefaultBrokerOptions, ExchangeType } from "@/brokers/broker";

export interface BaseConsumerOptions<TData> extends BaseBrokerOptions {
	readonly autoDelete?: boolean;
	readonly channel: Channel;

	readonly connection: Connection;
	readonly durable?: boolean;
	readonly exchangeName: string;
	readonly exchangeType?: ExchangeType;
	readonly prefetch?: number;
	readonly queueName: string;
	readonly routingKey?: string;

	readonly schema: ZodType<TData>;
}

type DefaultOptionsKeys = "autoDelete" | "durable" | "exchangeType" | "prefetch" | "routingKey";

export const DefaultConsumerOptions = {
	...DefaultBrokerOptions,
	exchangeType: ExchangeType.DIRECT,
	routingKey: "",
	durable: true,
	autoDelete: false,
	prefetch: 10,
} as const satisfies Required<Pick<BaseConsumerOptions<unknown>, DefaultOptionsKeys>>;

export interface ConsumerEvents {
	error: [error: string, meta?: unknown];
	info: [message: string];
}

export abstract class BaseConsumer<TData>
	extends AsyncEventEmitter<ConsumerEvents>
	implements IBaseBroker
{
	protected readonly options: Required<BaseConsumerOptions<TData>>;

	protected readonly connection: Connection;

	protected readonly channel: Channel;

	protected consumerTag?: string;

	public constructor(options: BaseConsumerOptions<TData>) {
		super();

		this.options = {
			...DefaultConsumerOptions,
			...options,
		};

		this.channel = this.options.channel;
		this.connection = this.options.connection;

		if (this.options.prefetch && this.options.prefetch > 0) {
			void this.channel.prefetch(this.options.prefetch);
		}
	}

	protected abstract handleMessage(
		data: TData,
		msg: ConsumeMessage,
		channel: Channel,
	): Promise<void>;

	public async consume(): Promise<void> {
		const { exchangeName, exchangeType, queueName, routingKey, durable, autoDelete } =
			this.options;

		await this.channel.assertExchange(exchangeName, exchangeType);
		const queue = await this.channel.assertQueue(queueName, {
			durable,
			autoDelete,
		});
		await this.channel.bindQueue(queue.queue, exchangeName, routingKey);
		const consumeResult = await this.channel.consume(queue.queue, this.onMessage.bind(this));

		this.consumerTag = consumeResult.consumerTag;
	}

	private async onMessage(msg: ConsumeMessage | null): Promise<void> {
		if (!msg) return;

		try {
			const rawData = this.options.decode(msg.content);
			const parsedData = this.validate(rawData);

			await this.handleMessage(parsedData, msg, this.channel);

			this.channel.ack(msg);
			this.emit("info", "Processed message");
		} catch (error) {
			this.channel.nack(msg, false, false);
			this.emit("error", "Error in consume handler:", error);
		}
	}

	private validate(rawData: unknown): TData {
		return this.options.schema.parse(rawData);
	}

	public async stop(): Promise<void> {
		if (this.consumerTag) {
			await this.channel.cancel(this.consumerTag);
		}
	}

	public async close(): Promise<void> {
		await this.channel.close();
		await this.connection.close();
	}
}
