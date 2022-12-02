require("dotenv").config();

import cors from "cors";
import express from "express";
import { AuthBasePath, BasePath } from "../shared";
import mongoConnect from "./config/mongoConnect";
import passportConfig from "./config/passportConfig";
import authRouter from "./routes/auth";


(async function () {
	await mongoConnect();
	const port = 3000;
	const app = express();
	const mainRouter = express.Router();

	passportConfig();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use(BasePath, mainRouter);
	mainRouter.use(AuthBasePath, authRouter);

	app.listen(process.env.PORT || port, () => console.log("Listening..."));
})();