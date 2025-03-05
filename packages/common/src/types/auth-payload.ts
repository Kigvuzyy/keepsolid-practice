import type { Role } from "@/utils/constants";

declare global {
	namespace Express {
		interface Request {
			currentUser?: IAuthPayload;
		}
	}
}

export interface IAuthPayload {
	email: string;
	iat?: number;
	id: number;
	role: Role;
	username: string;
}
