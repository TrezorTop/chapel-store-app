import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetMyInfoBasePath, GetMyInfoResponse } from "../../../../shared/endpoints/me/myInfo";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const myInfo = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetMyInfoResponse
	}>(GetMyInfoBasePath, {
		onRequest: [jwtOnRequestHook()],
	}, async (request, reply) => {
		const me = await prisma.user.findUnique({
			where: {
				username: request.user.username
			},
			select: {
				username: true,
				role: true
			}
		});

		return reply.status(StatusCodes.OK).send({
			me: me!
		});
	});
};