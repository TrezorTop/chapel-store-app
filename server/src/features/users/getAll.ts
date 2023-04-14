import { Role } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetAllUsersBasePath,
	GetAllUsersQuery,
	GetAllUsersResponse
} from "../../../../shared/endpoints/users/getAllUsers";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllUsersResponse,
		Querystring: GetAllUsersQuery
	}>(GetAllUsersBasePath, {
		onRequest: [optionalJwtOnRequestHook({ requiredRole: Role.ADMIN })]
	}, async (request, reply) => {
		const users = await prisma.user.findMany({
			select: {
				username: true
			}
		});

		return reply.status(StatusCodes.OK).send({ users: users });
	});
};