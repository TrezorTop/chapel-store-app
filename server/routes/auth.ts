import express from "express";
import { StatusCodes } from "http-status-codes";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../shared/register";
import { generateAccessToken, hashPassword } from "../features/auth";
import User from "../models/User";


const router = express.Router();

router.get<
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

router.get("/login", (req, res) => {

});

export default router;