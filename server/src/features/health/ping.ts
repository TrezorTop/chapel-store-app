import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { PingBasePath } from "../../../../shared/endpoints/health/ping";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";


export const ping = async (instance: FastifyInstance) => {
	instance.get(PingBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		return reply.status(StatusCodes.OK).send();
	});
};