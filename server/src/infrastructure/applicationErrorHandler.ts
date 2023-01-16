import { FastifyError, FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	ErrorResponse,
	General_FileIsTooLarge,
	General_WrongRequestSyntax,
	UndocumentedError
} from "../../../shared/consts/error";
import { logger } from "./utils";


export class ApplicationError {
	constructor(
		readonly status: StatusCodes,
		readonly message: string,
		readonly additionalInfo?: object
	) {
	}
}

const rules: {
	[key: string]: {
		status: StatusCodes,
		message: string,
		additionalInfo?: (error: FastifyError) => object
	}
} = {
	"LIMIT_FILE_SIZE": {
		status: StatusCodes.REQUEST_TOO_LONG,
		message: General_FileIsTooLarge
	}
};

export const setErrorHandler = (instance: FastifyInstance) => {
	instance.setErrorHandler((error: FastifyError | SyntaxError | ApplicationError, request, reply) => {
		if (error instanceof SyntaxError) {
			return reply.status(StatusCodes.BAD_REQUEST).send({
				message: General_WrongRequestSyntax
			} satisfies ErrorResponse);
		}

		if (error instanceof ApplicationError) {
			return reply.status(error.status).send({
				message: error.message,
				...(error.additionalInfo && {
					info: {
						...error.additionalInfo
					}
				})
			} satisfies ErrorResponse);
		}

		const rule = rules[error.code];
		if (rule)
			return reply.status(rule.status).send({
				message: rule.message,
				...(rule.additionalInfo && {
					info: {
						...rule.additionalInfo?.(error)
					}
				})
			} satisfies ErrorResponse);

		logger.error("Unhandled, undocumented error occured", {
			request: {
				url: request.raw.url,
				method: request.raw.method,
				body: request.body,
				query: request.query,
				params: request.params,
			},
			error: error
		});
		reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			message: UndocumentedError
		} satisfies ErrorResponse);
	});
};