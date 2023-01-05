import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { UndocumentedError } from "../../../shared/consts/error";


export class ApplicationError {
	constructor(
		readonly status: StatusCodes,
		readonly message: string
	) {
	}
}

export const setErrorHandler = (instance: FastifyInstance) => {
	instance.setErrorHandler((error, request, reply) => {
		if (error instanceof ApplicationError) {
			return reply.status(error.status).send({
				message: error.message
			});
		}

		console.error("Unhandled, undocumented error occured", {
			request: {
				url: request.raw.url,
				method: request.raw.method,
				body: request.body,
				query: request.query,
				params: request.params,
			},
			error: error
		});
		reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: UndocumentedError });
	});
};