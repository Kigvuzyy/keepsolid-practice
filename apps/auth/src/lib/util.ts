import { omit } from "@kigvuzyy/common";

import type { Auth } from "generated/client";
import type { IAuthOmittedUser } from "@kigvuzyy/types";

type OmittedKeys =
	| "emailVerificationToken"
	| "password"
	| "passwordResetExpires"
	| "passwordResetToken";

export const omitUser = (user: Auth): IAuthOmittedUser => {
	return omit<Auth, OmittedKeys>(user, [
		"emailVerificationToken",
		"password",
		"passwordResetToken",
		"passwordResetExpires",
	]);
};
