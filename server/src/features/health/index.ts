import express from "express";
import { StatusCodes } from "http-status-codes";
import { PingBasePath } from "../../../../shared/endpoints/health/ping";
import { jwtAuthMiddleware } from "../../infrastructure/passportConfig";
import { asyncWrapper } from "../../infrastructure/utils";


const router = express.Router();

router.get(PingBasePath, jwtAuthMiddleware(),
	asyncWrapper((req, res) => {
		res.status(StatusCodes.OK).send(req.user);
	})
);

export default router;