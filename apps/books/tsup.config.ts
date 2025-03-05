import { createTsupConfig } from "../../tsup.config";

export default createTsupConfig({
	entry: ["src/app.ts"],
	format: "cjs",
	dts: false,
	noExternal: ["@prisma/client"],
	external: ["elastic-apm-node"],
});
