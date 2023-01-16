import { Bundle } from "@prisma/client";
import axios from "axios";
import * as crypto from "crypto";
import cuid from "cuid";
import { FastifyInstance, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { CreatePurchases_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse,
	PaymentMethod
} from "../../../../shared/endpoints/purchases/createPurchases";
import { Validator } from "../../../../shared/types";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
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
	email: {
		check: [],
		required: false
	}
};

const handlers: {
	[key in PaymentMethod]: (request: FastifyRequest<{
		Reply: CreatePaymentResponse,
		Body: CreatePaymentRequest
	}>, bundle: Bundle) => Promise<CreatePaymentResponse>
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

		const bundle = await cancelIfFailed(() => prisma.bundle.findUnique({
				where: {
					id: body.bundleId
				}
			}), StatusCodes.NOT_FOUND, CreatePurchases_NotFound
		);

		const handler = handlers[body.method];
		const res = await handler(request, bundle);

		return reply.status(StatusCodes.OK).send({ url: res.url });
	});
};


async function cryptoCloudHandler(request: FastifyRequest<{
	Reply: CreatePaymentResponse,
	Body: CreatePaymentRequest
}>, bundle: Bundle): Promise<CreatePaymentResponse> {
	const { data } = await prisma.$transaction(async (tx) => {
		const order = await tx.uncomittedOrders.create({
			data: {
				ownerUsername: request.user.username,
				bundleId: bundle.id
			}
		});
		const res = await axios.post<CryptoCloud_CreateInvoiceResponse>("https://api.cryptocloud.plus/v1/invoice/create", {
			shop_id: process.env.CRYPTOCLOUD_SHOPID,
			amount: bundle.price,
			order_id: order.id,
			currency: "RUB",
			...(request.body.email && { email: request.body.email })
		}, {
			headers: {
				"Authorization": `Token ${process.env.CRYPTOCLOUD_TOKEN}`
			}
		});
		if (res.data.status === "error")
			throw new ApplicationError(StatusCodes.BAD_REQUEST, VeryBadThingsHappend);
		return res;
	});

	return { url: data.pay_url };
}


async function yookassaHandler(request: FastifyRequest<{
	Reply: CreatePaymentResponse,
	Body: CreatePaymentRequest
}>, bundle: Bundle): Promise<CreatePaymentResponse> {
	/*
	payment = Payment.create({
    "amount": {
        "value": "100.00",
        "currency": "RUB"
    },
    "confirmation": {
        "type": "redirect",
        "return_url": "https://www.example.com/return_url"
    },
    "capture": True,
    "description": "Заказ №37",
    "metadata": {
      "order_id": "37"
    }
})
	 */
	const { data } = await prisma.$transaction(async (tx) => {
		const order = await tx.uncomittedOrders.create({
			data: {
				ownerUsername: request.user.username,
				bundleId: bundle.id
			}
		});
		const authKey = Buffer.from(`${process.env.YOOKASSA_SHOPID}:${process.env.YOOKASSA_KEY}`).toString("base64");
		const res = await axios.post<Yookassa_CreateInvoiceResponse>("https://api.yookassa.ru/v3/payments", {
			capture: true,
			amount: {
				value: bundle.price,
				currency: "RUB"
			},
			receipt: {
				customer: {
					email: request.body.email
				}
			},
			"confirmation": {
				"type": "redirect",
				"return_url": process.env.YOOKASSA_REDIRECT
			},
			"description": `Заказ на бандл "${bundle.name}"`,
			metadata: {
				orderId: order.id
			} satisfies YookassaMetadata
		}, {
			headers: {
				"Authorization": `Basic ${authKey}`,
				"Idempotence-Key": crypto.randomUUID()
			}
		});
		if (res.data.status === "canceled")
			throw new ApplicationError(StatusCodes.BAD_REQUEST, VeryBadThingsHappend);
		return res;
	});

	return { url: data.confirmation.confirmation_url };
}