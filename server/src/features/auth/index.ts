import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	Login_WrongPasswordError,
	Login_WrongUsernameError,
	Refresh_UsedTokenError,
	Refresh_WrongTokenError
} from "../../../../shared/consts/error";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/login";
import { RefreshBasePath, RefreshRequest } from "../../../../shared/endpoints/refresh";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/register";
import RefreshToken from "../../domain/RefreshToken";
import User from "../../domain/User";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { authMiddleware } from "../../infrastructure/passportConfig";
import { asyncWrapper, cancelIfFalsy } from "../../infrastructure/utils";
import { comparePassword, decodeToken, generateTokens, getUserByUsername, hashPassword } from "./services";


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
>(RegisterBasePath, asyncWrapper(async (req, res) => {
	const { username, password } = req.body;

	const hash = await hashPassword(password);
	const user = new User({
		username: username,
		passwordHash: hash
	});

	await user.save();
	const tokens = await generateTokens(username, user.id);

	res.status(StatusCodes.CREATED).send(tokens);
}));

router.post<
	null,
	LoginResponse,
	LoginRequest
>(LoginBasePath, asyncWrapper(async (req, res) => {
	const { username, password } = req.body;

	const user = await getUserByUsername(username);
	cancelIfFalsy(user, new ApplicationError(StatusCodes.FORBIDDEN, Login_WrongUsernameError));

	const isPasswordCorrect = await comparePassword(password, user.passwordHash);
	cancelIfFalsy(isPasswordCorrect, new ApplicationError(StatusCodes.FORBIDDEN, Login_WrongPasswordError));

	const tokens = await generateTokens(username, user.id);

	return res.status(StatusCodes.OK).send(tokens);
}));

router.post<
	null,
	RefreshRequest,
	RefreshRequest
>(RefreshBasePath, asyncWrapper(async (req, res) => {
	const { refreshToken } = req.body;

	const payload = decodeToken(refreshToken);
	cancelIfFalsy(payload, new ApplicationError(StatusCodes.FORBIDDEN, Refresh_WrongTokenError));

	const token = await RefreshToken.findOneAndDelete({ token: refreshToken }).exec();
	cancelIfFalsy(token, new ApplicationError(StatusCodes.FORBIDDEN, Refresh_UsedTokenError));

	const tokens = await generateTokens(payload.owner, token.id);

	return res.status(StatusCodes.OK).send(tokens);
}));

export default router;