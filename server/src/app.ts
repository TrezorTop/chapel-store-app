require("dotenv").config();

import cors from "cors";
import express from "express";
import passport from "passport";
import { AuthBasePath, BasePath } from "../../shared";
import authRouter from "./features/auth";
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
	mainRouter.use(AuthBasePath, authRouter);
	app.use(applicationErrorHandler);

	app.listen(process.env.PORT || port, () => console.log("Listening..."));
})().catch(x => console.error(x));