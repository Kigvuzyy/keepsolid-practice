import { StatusCodes } from "http-status-codes";

export interface IErrorResponse {
	comingFrom: string;
	message: string;
	serializeError(): IError;
	status: string;
	statusCode: number;
}

export interface IError {
	comingFrom: string;
	message: string;
	status: string;
	statusCode: number;
}

export abstract class CustomError extends Error {
	public readonly comingFrom: string;

	public abstract readonly status: string;

	public abstract readonly statusCode: number;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message);
		this.comingFrom = comingFrom;
	}

	public serializeErrors(): IError {
		return {
			message: this.message,
			statusCode: this.statusCode,
			status: this.status,
			comingFrom: this.comingFrom,
		};
	}
}

export class BadRequestError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.BAD_REQUEST;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}

export class NotFoundError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.NOT_FOUND;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}
export class ForbiddenError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.FORBIDDEN;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}

export class NotAuthorizedError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.UNAUTHORIZED;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}

export class FileTooLargeError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.REQUEST_TOO_LONG;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}

export class ServerError extends CustomError {
	public status: string = "error";

	public statusCode: number = StatusCodes.SERVICE_UNAVAILABLE;

	public constructor(
		public override readonly message: string,
		comingFrom: string,
	) {
		super(message, comingFrom);
	}
}

export interface ErrnoException extends Error {
	code?: string;
	errno?: number;
	path?: string;
	stack?: string;
	syscall?: string;
}
