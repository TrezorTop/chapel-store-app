import express from "express";
import { StatusCodes } from "http-status-codes";
import { LoginRequest, LoginResponse } from "../../../shared/login";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../shared/register";
import { authMiddleware } from "../../config/passportConfig";
import User from "../../models/User";
import { comparePassword, generateAccessToken, getUserByUsername, hashPassword } from "./services";


const router = express.Router();

router.get("/ping", authMiddleware,
	(req, res) => {
		res.status(StatusCodes.OK).send();
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

router.post<
	null,
	LoginResponse,
	LoginRequest
>("/login", async (req, res) => {
	const { username, password } = req.body;

	const user = await getUserByUsername(username);

	if (!user)
		return res.status(StatusCodes.UNAUTHORIZED).send();

	const isPasswordCorrect = await comparePassword(password, user.passwordHash);

	if (!isPasswordCorrect)
		return res.status(StatusCodes.UNAUTHORIZED).send();

	return res.status(StatusCodes.OK).send();
});

export default router;