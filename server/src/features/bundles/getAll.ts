import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	GetAllBundlesBasePath,
	GetAllBundlesQuery,
	GetAllBundlesResponse
} from "../../../../shared/endpoints/bundles/getAllBundles";
import { Validator } from "../../../../shared/types";
import { optionalJwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const queryValidator: Validator<GetAllBundlesQuery> = {
	carId: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: false
	},
	role: {
		check: [],
		required: false
	},
	type: {
		check: [],
		required: false
	}
};


export const getAll = async (instance: FastifyInstance) => {
	instance.get<{
		Reply: GetAllBundlesResponse,
		Querystring: GetAllBundlesQuery
	}>(GetAllBundlesBasePath, {
		onRequest: [optionalJwtOnRequestHook()],
		preValidation: [validatePreValidationHook({ query: queryValidator })]
	}, async (request, reply) => {
		const query = request.query;
		const isAdmin = request?.user?.role === "ADMIN";

		const bundles = await prisma.bundle.findMany({
			where: {
				...(query.type && {
					type: query.type
				}),
				...(query.carId && {
					configs: {
						some: {
							config: {
								carId: query.carId,
							}
						}
					}
				}),
				...(query.role === "USER" && request?.user?.username && {
					purchases: {
						none: {
							ownerUsername: request?.user?.username
						}
					}
				}),
				...(!isAdmin && { softDeleted: false }),
			},
			select: {
				id: true,
				name: true,
				softDeleted: isAdmin,
				type: true,
				price: true,
				createdAt: true,
				updatedAt: true,
				configs: {
					select: {
						config: {
							select: {
								id: true,
								title: true
							}
						}
					}
				}
			},
			orderBy: {
				configs: {
					_count: "desc"
				}
			}
		});

		return reply.status(StatusCodes.OK).send({ bundles: bundles });
	});
};