import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { DeleteUncommittedOrder_NotFound } from "../../../../shared/consts/error";
import {
	DeleteUncommittedOrderBasePath,
	DeleteUncommittedOrderParams,
	DeleteUncommittedOrderResponse
} from "../../../../shared/endpoints/me/deleteUncommittedOrder";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<DeleteUncommittedOrderParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const deleteUncommittedOrder = async (instance: FastifyInstance) => {
	instance.delete<{
		Reply: DeleteUncommittedOrderResponse,
		Params: DeleteUncommittedOrderParams
	}>(DeleteUncommittedOrderBasePath, {
		onRequest: [jwtOnRequestHook()],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		await cancelIfFailed(() => prisma.uncommittedOrders.findFirst({
				where: {
					id: params.id,
					ownerUsername: request.user.username
				}
			}), StatusCodes.NOT_FOUND, DeleteUncommittedOrder_NotFound
		);

		await prisma.uncommittedOrders.deleteMany({
			where: {
				id: params.id,
				ownerUsername: request.user.username
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};
