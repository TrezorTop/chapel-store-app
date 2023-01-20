import { Bundle, Promocode } from "@prisma/client";
import axios from "axios";
import * as crypto from "crypto";
import cuid from "cuid";
import { FastifyInstance, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	CreatePurchases_BundleNotFound,
	CreatePurchases_PromocodeNotFound,
	VeryBadThingsHappend
} from "../../../../shared/consts/error";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/purchases/createPurchases";
import { Validator } from "../../../../shared/types";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { PaymentMethod, prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { applyDiscount } from "../promocodes/apply";
import { CryptoCloud_CreateInvoiceResponse, Yookassa_CreateInvoiceResponse, YookassaMetadata } from "./index";


const bodyValidator: Validator<CreatePaymentRequest> = {
	method: {
		check: [],
		required: true
	},
	bundleId: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	},
	promocodeName: {
		check: [],
		required: false
	},
	email: {
		check: [],
		required: false
	}
};

type Handler = (request: FastifyRequest<{
	Reply: CreatePaymentResponse,
	Body: CreatePaymentRequest
}>, bundle: Bundle, options: {
	promocode?: Promocode
}) => Promise<CreatePaymentResponse>

const cryptoCloudHandler: Handler = async (request: FastifyRequest<{
	Reply: CreatePaymentResponse,
	Body: CreatePaymentRequest
}>, bundle, { promocode } = {}): Promise<CreatePaymentResponse> => {
	const { data } = await prisma.$transaction(async (tx) => {
		const id = cuid();
		const res = await axios.post<CryptoCloud_CreateInvoiceResponse>("https://api.cryptocloud.plus/v1/invoice/create", {
			shop_id: process.env.CRYPTOCLOUD_SHOPID,
			amount: (promocode && applyDiscount(bundle.price, promocode?.discountToUser)) ?? bundle.price,
			order_id: id,
			currency: "RUB",
			...(request.body.email && { email: request.body.email })
		}, {
			headers: {
				"Authorization": `Token ${process.env.CRYPTOCLOUD_TOKEN}`
			}
		});
		const order = await tx.uncommittedOrders.create({
			data: {
				id: id,
				promocodeName: promocode?.name,
				method: PaymentMethod.CRYPTOCLOUD,
				ownerUsername: request.user.username,
				bundleId: bundle.id,
				paymentId: res.data.invoice_id
			}
		});
		if (res.data.status === "error")
			throw new ApplicationError(StatusCodes.BAD_REQUEST, VeryBadThingsHappend);
		return res;
	});

	return { url: data.pay_url };
};


const yookassaHandler: Handler = async (request: FastifyRequest<{
	Reply: CreatePaymentResponse,
	Body: CreatePaymentRequest
}>, bundle, { promocode } = {}): Promise<CreatePaymentResponse> => {
	const { data } = await prisma.$transaction(async (tx) => {
		const id = cuid();
		const authKey = Buffer.from(`${process.env.YOOKASSA_SHOPID}:${process.env.YOOKASSA_KEY}`).toString("base64");
		const res = await axios.post<Yookassa_CreateInvoiceResponse>("https://api.yookassa.ru/v3/payments", {
			capture: true,
			amount: {
				value: (promocode && applyDiscount(bundle.price, promocode?.discountToUser)) ?? bundle.price,
				currency: "RUB"
			},
			"confirmation": {
				"type": "redirect",
				"return_url": process.env.YOOKASSA_REDIRECT
			},
			"description": `ORDER FOR "${bundle.name}"`,
			metadata: {
				orderId: id
			} satisfies YookassaMetadata
		}, {
			headers: {
				"Authorization": `Basic ${authKey}`,
				"Idempotence-Key": crypto.randomUUID()
			}
		});
		const order = await tx.uncommittedOrders.create({
			data: {
				id: id,
				promocodeName: promocode?.name,
				ownerUsername: request.user.username,
				method: PaymentMethod.YOOKASSA,
				bundleId: bundle.id,
				paymentId: res.data.id
			}
		});
		if (res.data.status === "canceled")
			throw new ApplicationError(StatusCodes.BAD_REQUEST, VeryBadThingsHappend);
		return res;
	});

	return { url: data.confirmation.confirmation_url };
};

const handlers: {
	[key in PaymentMethod]: Handler
} = {
	[PaymentMethod.CRYPTOCLOUD]: cryptoCloudHandler,
	[PaymentMethod.YOOKASSA]: yookassaHandler,
};

export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreatePaymentResponse,
		Body: CreatePaymentRequest
	}>(CreatePaymentBasePath, {
		onRequest: [jwtOnRequestHook()],
		preValidation: [validatePreValidationHook({ body: bodyValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const bundle = await cancelIfFailed(() => prisma.bundle.findFirst({
				where: {
					id: body.bundleId,
					purchases: {
						none: {
							ownerUsername: request.user.username
						}
					}
				}
			}), StatusCodes.NOT_FOUND, CreatePurchases_BundleNotFound
		);
		const promocode = await cancelIfFailed(() => prisma.promocode.findFirst({
			where: {
				name: body.promocodeName,
			}
		}), StatusCodes.NOT_FOUND, CreatePurchases_PromocodeNotFound);

		const handler = handlers[body.method];
		const res = await handler(request, bundle, { promocode: promocode });

		return reply.status(StatusCodes.OK).send({ url: res.url });
	});
};