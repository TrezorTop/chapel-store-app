import express from "express";
import { StatusCodes } from "http-status-codes";
import { Config_NotFoundError } from "../../../../shared/consts/error";
import { ConfigParams, ConfigResponse } from "../../../../shared/endpoints/configs/getOne";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper, cancelIfFailed } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	ConfigResponse,
	null,
	ConfigParams
>("/", asyncWrapper(async (req, res) => {
	const query = req.query;

	const config = await cancelIfFailed(async () => {
		return await prisma.config.findUnique({
			where: {
				carId_bundleId: {
					carId: query.carId,
					bundleId: query.bundleId
				}
			},
			select: {
				data: true
			}
		});
	}, StatusCodes.NOT_FOUND, Config_NotFoundError);

	res.status(StatusCodes.OK).send({ config: config });
}));

export default router;