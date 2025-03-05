import { Buffer } from "node:buffer";

import { encode, decode } from "@msgpack/msgpack";

export const enum ExchangeType {
	DIRECT = "direct",
	FANOUT = "fanout",
}

export interface BaseBrokerOptions {
	decode?(data: Buffer): unknown;
	encode?(data: unknown): Buffer;
}

export const DefaultBrokerOptions = {
	encode: (data: unknown): Buffer => {
		const encoded = encode(data);
		return Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
	},
	decode: (data: Buffer): unknown => decode(data),
} as const satisfies Required<BaseBrokerOptions>;

export interface IBaseBroker {
	close(): Promise<void>;
	consume(): Promise<void>;
	stop(): Promise<void>;
}
