import process from "node:process";
import { setTimeout } from "node:timers";

import amqp from "amqplib";

import type { Logger } from "winston";
import type { Channel, Connection } from "amqplib";

import { getBackoffDelay } from "@/brokers/util";

const DEFAULT_BASE_DELAY = 1000;
const DEFAULT_MAX_DELAY = 30000;

let connection: Connection | null = null;
let channel: Channel | null = null;

let reconnectAttempts = 0;

interface IConnectionOptions {
	baseDelay?: number;
	logger?: Logger;
	maxDelay?: number;
	uri: string;
}

export const connectRabbit = async (
	options: IConnectionOptions,
	onConnect?: (channel: Channel, connection: Connection) => Promise<void>,
) => {
	const { uri, logger } = options;

	try {
		connection = await amqp.connect(uri);
		logger?.info("Connected to queue successfully");

		channel = await connection.createChannel();

		reconnectAttempts = 0;

		connection.on("close", async (error) => {
			logger?.log("error", "RabbitMQ connection closed:", error);
			reconnect(options, onConnect);
		});

		connection.on("error", (error) => {
			logger?.log("error", "RabbitMQ connection error:", error);
			reconnect(options, onConnect);
		});

		await onConnect?.(channel, connection);
	} catch (error) {
		logger?.log("error", "Failed to connect to RabbitMQ:", error);
		reconnect(options, onConnect);
	}
};

function reconnect(
	options: IConnectionOptions,
	onConnect?: (channel: Channel, connection: Connection) => Promise<void>,
) {
	if (connection) {
		try {
			void connection.close();
		} catch {}
	}

	connection = null;
	channel = null;

	reconnectAttempts++;

	const delay = getBackoffDelay(
		reconnectAttempts,
		options.baseDelay ?? DEFAULT_BASE_DELAY,
		options.maxDelay ?? DEFAULT_MAX_DELAY,
	);

	options.logger?.log("error", `Reconnecting in ${delay} ms... (attempt: ${reconnectAttempts})`);

	setTimeout(async () => connectRabbit(options, onConnect), delay);
}

export const getRabbitChannel = (): Channel => {
	if (!channel) {
		throw new Error("RabbitMQ channel is not established yet.");
	}

	return channel;
};

export const getRabbitConnection = (): Connection => {
	if (!connection) {
		throw new Error("RabbitMQ connection is not established yet.");
	}

	return connection;
};

process.once("SIGINT", async () => {
	console.log("Received SIGINT (Ctrl+C). Closing RabbitMQ connection...");
	await channel?.close();
	await connection?.close();
	process.exit(0);
});

process.once("SIGTERM", async () => {
	console.log("Received SIGTERM (Docker stop). Closing RabbitMQ connection...");
	await channel?.close();
	await connection?.close();
	process.exit(0);
});
