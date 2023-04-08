import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreateManualPurchases_BundleNotFound,
	CreateManualPurchases_UserNotFound
} from "../../../../shared/consts/error";
import { CreateConfigsBasePath } from "../../../../shared/endpoints/configs/createConfigs";
import {
	CreateManualPaymentRequest,
	CreateManualPaymentResponse
} from "../../../../shared/endpoints/purchases/createManualPurchases";
import { Validator } from "../../../../shared/types";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const bodyValidator: Validator<CreateManualPaymentRequest> = {
	bundleId: {
		check: [value => cuid.isCuid(value) || "Невалидный bundleId"],
		required: true
	},
	ownerUsername: {
		check: [value => cuid.isCuid(value) || "Невалидный ownerUsername"],
		required: true
	},
};


export const createManual = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreateManualPaymentResponse,
		Body: CreateManualPaymentRequest
	}>(CreateConfigsBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: bodyValidator })]
	}, async (request, reply) => {
		const body = request.body;

		await cancelIfFailed(() => prisma.bundle.findFirst({
				where: {
					id: body.bundleId,
					purchases: {
						none: {
							ownerUsername: request.user.username
						}
					}
				}
			}), StatusCodes.NOT_FOUND, CreateManualPurchases_BundleNotFound
		);
		await cancelIfFailed(() => prisma.user.findUnique({
				where: {
					username: body.ownerUsername
				}
			}), StatusCodes.NOT_FOUND, CreateManualPurchases_UserNotFound
		);

		await prisma.purchases.create({
			data: {
				ownerUsername: body.ownerUsername,
				bundleId: body.bundleId
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};