export type * from "@/interfaces/auth.interface";
export type * from "@/interfaces/books.interface";
export type * from "@/interfaces/notification.interface";

/**
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = "[VI]{{inject}}[/VI]" as string;
