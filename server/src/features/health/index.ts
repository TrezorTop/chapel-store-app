import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import { PingBasePath } from "../../../../shared/endpoints/health/ping";
import { jwtMiddleware } from "../../infrastructure/jwtConfig";


const module: FastifyPluginAsync = async (instance) => {
	instance.get(PingBasePath, {
		onRequest: [jwtMiddleware]
	}, async (request, reply) => {
		return reply.status(StatusCodes.OK).send();
	});
};

export default module;