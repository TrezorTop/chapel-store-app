import express from "express";
import { StatusCodes } from "http-status-codes";
import { GetAllCarsBasePath, GetAllCarsResponse } from "../../../../shared/endpoints/cars/getAll";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	GetAllCarsResponse,
	null
>(GetAllCarsBasePath, asyncWrapper(async (req, res) => {
	const cars = await prisma.car.findMany({
		select: {
			id: true,
			name: true
		}
	});

	res.status(StatusCodes.OK).send({ cars: cars });
}));

export default router;