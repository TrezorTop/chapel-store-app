require("dotenv").config();

import cors from "cors";
import express from "express";


(async function () {
	const port = 3000;
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use("/", (req, res) => {
		res.send("New Oke");
	});

	app.listen(process.env.PORT || port, () => console.log("Listening..."));
})().catch(x => console.error(x));


// (async function () {
// 	await mongoConnect();
// 	const port = 3000;
// 	const app = express();
// 	const mainRouter = express.Router();
//
// 	passportConfig();
// 	app.use(cors());
// 	app.use(express.json());
// 	app.use(express.urlencoded({ extended: false }));
//
// 	app.use(BasePath, mainRouter);
// 	mainRouter.use(AuthBasePath, authRouter);
// 	app.use(applicationErrorHandler);
//
// 	app.listen(process.env.PORT || port, () => console.log("Listening..."));
// })().catch(x => console.error(x));