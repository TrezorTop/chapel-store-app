require("dotenv").config();

import cors from "cors";
import express from "express";
import passport from "passport";
import {
	AuthRootPath,
	BasePath,
	BundlesRootPath,
	CarsRootPath,
	ConfigsRootPath,
	HealthRootPath,
	PaymentsRootPath
} from "../../shared";
import authRouter from "./features/auth";
import bundlesRouter from "./features/bundles";
import carsRouter from "./features/cars";
import configsRouter from "./features/configs";
import healthRouter from "./features/health";
import paymentsRouter from "./features/payments";
import { applicationErrorHandler } from "./infrastructure/applicationErrorHandler";
import passportConfig from "./infrastructure/passportConfig";


(async function () {
	const port = 3000;
	const app = express();
	const mainRouter = express.Router();

	app.use(passport.initialize());
	passportConfig();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use(BasePath, mainRouter);
	mainRouter.use(AuthRootPath, authRouter);
	mainRouter.use(CarsRootPath, carsRouter);
	mainRouter.use(BundlesRootPath, bundlesRouter);
	mainRouter.use(ConfigsRootPath, configsRouter);
	mainRouter.use(PaymentsRootPath, paymentsRouter);
	mainRouter.use(HealthRootPath, healthRouter);
	app.use(applicationErrorHandler);

	app.listen(process.env.PORT || port, () => console.log("Listening..."));
})().catch(x => console.error(x));