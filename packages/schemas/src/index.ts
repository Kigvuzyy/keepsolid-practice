export * from "@/schemas/common.schemas";
export * from "@/schemas/auth-service.schemas";
export * from "@/schemas/books-service.schema";

/**
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = "[VI]{{inject}}[/VI]" as string;
