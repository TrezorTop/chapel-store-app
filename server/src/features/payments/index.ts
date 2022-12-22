import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/payments/createPayment";
import { GetUserConfigsBasePath, GetUserConfigsResponse } from "../../../../shared/endpoints/payments/getUserConfigs";
import { jwtAuthMiddleware } from "../../infrastructure/passportConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	GetUserConfigsResponse
>(GetUserConfigsBasePath, jwtAuthMiddleware(), asyncWrapper(async (req, res) => {
	const configs = await prisma.config.findMany({
		where: {
			purchases: {
				some: {
					ownerUsername: req.user!.username
				}
			}
		},
		select: {
			id: true,
			data: true,
			title: true
		}
	});

	res.status(StatusCodes.OK).send({ configs: configs });
}));

router.post<
	null,
	CreatePaymentResponse,
	CreatePaymentRequest
>(CreatePaymentBasePath, jwtAuthMiddleware(), asyncWrapper(async (req, res) => {
	const body = req.body;

	const purchases = await prisma.purchases.create({
		data: {
			ownerUsername: req.user!.username,
			configId: body.configId
		}
	});

	res.status(StatusCodes.OK).send({ url: "hueta" });
}));

export default router;