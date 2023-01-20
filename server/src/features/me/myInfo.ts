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
		const res = await prisma.user.findUnique({
			where: {
				username: request.user.username
			},
			select: {
				username: true,
				role: true,
				_count: {
					select: {
						uncommittedOrders: true
					}
				}
			}
		});

		return reply.status(StatusCodes.OK).send({
			me: {
				username: res!.username,
				role: res!.role,
				isUnprocessedOrders: !!res!._count.uncommittedOrders
			}
		});
	});
};