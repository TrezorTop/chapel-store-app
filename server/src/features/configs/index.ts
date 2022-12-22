import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	GetAllConfigBasePath,
	GetAllConfigParams,
	GetAllConfigResponse
} from "../../../../shared/endpoints/configs/getAll";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	GetAllConfigResponse,
	null,
	GetAllConfigParams
>(GetAllConfigBasePath, asyncWrapper(async (req, res) => {
	const query = req.query;

	const configs = await prisma.config.findMany({
		where: {
			carId: query.carId,
			bundleId: query.bundleId
		},
		select: {
			title: true,
			data: true
		}
	});

	res.status(StatusCodes.OK).send({ configs: configs });
}));

export default router;