import express from "express";
import { StatusCodes } from "http-status-codes";
import { GetAllBundlesBasePath, GetAllBundlesResponse } from "../../../../shared/endpoints/bundles/getAll";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	GetAllBundlesResponse,
	null
>(GetAllBundlesBasePath, asyncWrapper(async (req, res) => {
	const bundles = await prisma.bundle.findMany({
		select: {
			id: true,
			name: true
		}
	});

	res.status(StatusCodes.OK).send({ bundles: bundles });
}));

export default router;