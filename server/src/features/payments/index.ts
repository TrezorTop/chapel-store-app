import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	CreatePaymentBasePath,
	CreatePaymentRequest,
	CreatePaymentResponse
} from "../../../../shared/endpoints/payments/createPayment";
import { jwtAuthMiddleware } from "../../infrastructure/passportConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

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