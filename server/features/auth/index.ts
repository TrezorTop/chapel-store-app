import express from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { Secret } from "jsonwebtoken";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../shared/login";
import { RefreshBasePath, RefreshRequest } from "../../../shared/refresh";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../shared/register";
import { authMiddleware } from "../../config/passportConfig";
import RefreshToken from "../../models/RefreshToken";
import User from "../../models/User";
import { JwtAccessTokenPayload } from "../types";
import { comparePassword, generateTokens, getUserByUsername, hashPassword } from "./services";


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
	const tokens = await generateTokens(username, user.id);

	res.status(StatusCodes.CREATED).send(tokens);
});

router.post<
	null,
	LoginResponse,
	LoginRequest
>(LoginBasePath, async (req, res) => {
	const { username, password } = req.body;

	const user = await getUserByUsername(username);

	if (!user)
		return res.status(StatusCodes.UNAUTHORIZED).send();

	const isPasswordCorrect = await comparePassword(password, user.passwordHash);

	if (!isPasswordCorrect)
		return res.status(StatusCodes.UNAUTHORIZED).send();

	const tokens = await generateTokens(username, user.id);

	return res.status(StatusCodes.OK).send(tokens);
});

router.post<
	null,
	RefreshRequest,
	RefreshRequest
>(RefreshBasePath, async (req, res) => {
	let tokens;

	try {
		const { refreshToken } = req.body;

		const payload = await jwt.verify(refreshToken, process.env.JWT_SECRET as Secret) as JwtAccessTokenPayload;
		const token = await RefreshToken.findOneAndDelete({ token: refreshToken }).exec();

		if (!token)
			return res.status(StatusCodes.FORBIDDEN).send();

		tokens = await generateTokens(payload.owner, token.id);
	} catch (e) {
		return res.status(400).send(e);
	}

	return res.status(StatusCodes.OK).send(tokens);
});

export default router;