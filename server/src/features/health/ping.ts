import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { PingBasePath } from "../../../../shared/endpoints/health/ping";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";


export const ping = async (instance: FastifyInstance) => {
	instance.get(PingBasePath, {
		onRequest: [jwtOnRequestHook()]
	}, async (request, reply) => {
		throw new Error("gdfhfj");
		return reply.status(StatusCodes.OK).send();
	});
};