import express from "express";
import { StatusCodes } from "http-status-codes";
import { PingBasePath } from "../../../../shared/endpoints/health/ping";
import { jwtAuthMiddleware } from "../../infrastructure/passportConfig";


const router = express.Router();

router.get(PingBasePath, jwtAuthMiddleware,
	(req, res) => {
		res.status(StatusCodes.OK).send(req.user);
	}
);

export default router;