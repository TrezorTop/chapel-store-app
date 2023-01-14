import { Role } from "@prisma/client";
import axios from "axios";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CreatePurchases_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/purchases/createPurchases";
import { Validator } from "../../../../shared/types";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { CreateInvoiceResponse } from "./index";


const bodyValidator: Validator<CreatePaymentRequest> = {
	bundleId: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	},
	email: {
		check: [],
		required: false
	}
};


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreatePaymentResponse,
		Body: CreatePaymentRequest
	}>(CreatePaymentBasePath, {
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: bodyValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const bundle = await cancelIfFailed(() => prisma.bundle.findUnique({
				where: {
					id: body.bundleId
				}
			}), StatusCodes.NOT_FOUND, CreatePurchases_NotFound
		);

		const res = await prisma.$transaction(async (tx) => {
			const order = await tx.uncomittedOrders.create({
				data: {
					ownerUsername: request.user.username,
					bundleId: bundle.id
				}
			});
			const res = await axios.post<CreateInvoiceResponse>("https://api.cryptocloud.plus/v1/invoice/create", {
				shop_id: process.env.CRYPTOCLOUD_SHOPID,
				amount: bundle.price,
				order_id: order.id,
				currency: "RUB",
				...(body.email && { email: body.email })
			}, {
				headers: {
					"Authorization": `Token ${process.env.CRYPTOCLOUD_TOKEN}`
				}
			});
			if (res.data.status === "error")
				throw new ApplicationError(StatusCodes.BAD_REQUEST, VeryBadThingsHappend);
			return res;
		});

		return reply.status(StatusCodes.OK).send({ url: res.data.pay_url });
	});
};