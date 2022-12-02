import dotenv from "dotenv";
import express from "express";
import mongoConnect from "./config/mongoConnect";
import indexRouter from "./routes/main";


(async function () {
	dotenv.config();
	await mongoConnect();
	const port = 3000;
	const app = express();
	const mainRouter = express.Router();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use("/api", mainRouter);
	mainRouter.use("/", indexRouter);

	app.listen(port, () => console.log("Listening..."));
})();