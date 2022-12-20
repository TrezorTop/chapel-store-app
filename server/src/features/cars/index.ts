import express from "express";
import { StatusCodes } from "http-status-codes";
import { CarsResponse } from "../../../../shared/endpoints/cars/getAll";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get<
	null,
	CarsResponse,
	null
>("/", asyncWrapper(async (req, res) => {
	const cars = await prisma.car.findMany({
		select: {
			id: true,
			name: true
		}
	});

	res.status(StatusCodes.OK).send({ cars: cars });
}));

export default router;