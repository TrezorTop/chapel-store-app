import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	Login_WrongPasswordError,
	Login_WrongUsernameError,
	Refresh_UsedTokenError,
	Refresh_WrongTokenError
} from "../../../../shared/consts/error";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/login";
import { PingBasePath } from "../../../../shared/endpoints/ping";
import { RefreshBasePath, RefreshRequest } from "../../../../shared/endpoints/refresh";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/register";
import { authMiddleware } from "../../infrastructure/passportConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper, cancelIfFailed } from "../../infrastructure/utils";
import { comparePassword, decodeToken, generateTokens, getUserByUsername, hashPassword } from "./services";


const router = express.Router();

router.get(PingBasePath, authMiddleware,
	(req, res) => {
		res.status(StatusCodes.OK).send(req.user);
	}
);

router.post<
	null,
	RegisterResponse,
	RegisterRequest
>(RegisterBasePath, asyncWrapper(async (req, res) => {
	const { username, password } = req.body;

	const hash = await hashPassword(password);
	const tokens = await generateTokens(username);
	await prisma.user.create({
		data: {
			username: username,
			passwordHash: hash,
			tokens: {
				create: {
					token: tokens.refreshToken
				}
			}
		}
	});

	res.status(StatusCodes.CREATED).send(tokens);
}));

router.post<
	null,
	LoginResponse,
	LoginRequest
>(LoginBasePath, asyncWrapper(async (req, res) => {
	const { username, password } = req.body;

	const user = await cancelIfFailed(() => getUserByUsername(username),
		StatusCodes.FORBIDDEN, Login_WrongUsernameError
	);
	await cancelIfFailed(() => comparePassword(password, user.passwordHash),
		StatusCodes.FORBIDDEN, Login_WrongPasswordError
	);

	const tokens = await generateTokens(username);
	await prisma.refreshToken.create({
		data: {
			token: tokens.refreshToken,
			ownerUsername: username
		}
	});

	return res.status(StatusCodes.OK).send(tokens);
}));

router.post<
	null,
	RefreshRequest,
	RefreshRequest
>(RefreshBasePath, asyncWrapper(async (req, res) => {
	const { refreshToken } = req.body;

	const payload = await cancelIfFailed(async () => decodeToken(refreshToken),
		StatusCodes.FORBIDDEN, Refresh_WrongTokenError
	);

	await cancelIfFailed(() =>
		prisma.refreshToken.delete({
			where: {
				token: refreshToken
			}
		}), StatusCodes.FORBIDDEN, Refresh_UsedTokenError
	);
	const tokens = await generateTokens(payload.ownerUsername);
	await prisma.refreshToken.create({
		data: {
			token: tokens.refreshToken,
			ownerUsername: payload.ownerUsername
		}
	});

	return res.status(StatusCodes.OK).send(tokens);
}));

export default router;