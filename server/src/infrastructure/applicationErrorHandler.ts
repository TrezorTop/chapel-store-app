import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse, UndocumentedError } from "../../../shared/consts/error";


export class ApplicationError {
	constructor(
		readonly status: StatusCodes,
		readonly message: string
	) {
	}
}

export const applicationErrorHandler: ErrorRequestHandler<
	null, ErrorResponse
> = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}

	if (err instanceof ApplicationError) {
		return res.status(err.status).send({
			message: err.message
		});
	}

	res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: UndocumentedError });
};