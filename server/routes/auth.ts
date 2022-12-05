import express from "express";
import { StatusCodes } from "http-status-codes";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../shared/register";
import { authMiddleware } from "../config/passportConfig";
import { generateAccessToken, hashPassword } from "../features/auth";
import User from "../models/User";


const router = express.Router();

router.get("/test", authMiddleware,
	(req, res) => {
		console.log(req.user);

		res.send("Ok");
	}
);

router.post<
	null,
	RegisterResponse,
	RegisterRequest
>(RegisterBasePath, async (req, res) => {
	const { username, password } = req.body;

	const hash = await hashPassword(password);
	const user = new User({
		username: username,
		passwordHash: hash
	});

	await user.save();
	const accessToken = generateAccessToken(username);

	res.status(StatusCodes.CREATED).send({
		accessToken: accessToken
	});
});

router.post("/login", (req, res) => {

});

export default router;