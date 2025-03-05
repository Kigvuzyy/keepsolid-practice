export * from "@/utils/logger";
export * from "@/utils/helpers";
export * from "@/utils/constants";
export * from "@/utils/error.handler";

export type * from "@/types/auth-payload";

export * from "@/middlewares/admin-verify";
export * from "@/middlewares/current-user";
export * from "@/middlewares/gateway-verify";
export * from "@/middlewares/validate-request";

/**
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = "[VI]{{inject}}[/VI]" as string;
