export * from "@/brokers/rabbit/connection";
export * from "@/brokers/rabbit/base.consumer";
export * from "@/brokers/rabbit/base.producer";

export * from "@/brokers/broker";

/**
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = "[VI]{{inject}}[/VI]" as string;
