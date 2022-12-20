import express from "express";
import { StatusCodes } from "http-status-codes";
import {
	Login_WrongPasswordError,
	Login_WrongUsernameError,
	Refresh_UsedTokenError,
	Refresh_WrongTokenError
} from "../../../../shared/consts/error";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshBasePath, RefreshRequest } from "../../../../shared/endpoints/auth/refresh";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { prisma } from "../../infrastructure/prismaConnect";
import { asyncWrapper, cancelIfFailed } from "../../infrastructure/utils";
import { comparePassword, decodeToken, generateTokens, getUserByUsername, hashPassword } from "./services";


const router = express.Router();

router.post<
	null,
	RegisterResponse,
	RegisterRequest
>(RegisterBasePath, asyncWrapper(async (req, res) => {
	const body = req.body;

	const hash = await hashPassword(body.password);
	const tokens = generateTokens(body.username);
	await prisma.user.create({
		data: {
			username: body.username,
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
	const body = req.body;

	const user = await cancelIfFailed(() => getUserByUsername(body.username),
		StatusCodes.FORBIDDEN, Login_WrongUsernameError
	);
	await cancelIfFailed(() => comparePassword(body.password, user.passwordHash),
		StatusCodes.FORBIDDEN, Login_WrongPasswordError
	);

	const tokens = generateTokens(body.username);
	await prisma.refreshToken.create({
		data: {
			token: tokens.refreshToken,
			ownerUsername: body.username
		}
	});

	return res.status(StatusCodes.OK).send(tokens);
}));

router.post<
	null,
	RefreshRequest,
	RefreshRequest
>(RefreshBasePath, asyncWrapper(async (req, res) => {
	const body = req.body;

	const payload = await cancelIfFailed(async () => decodeToken(body.refreshToken),
		StatusCodes.FORBIDDEN, Refresh_WrongTokenError
	);

	await cancelIfFailed(() =>
		prisma.refreshToken.delete({
			where: {
				token: body.refreshToken
			}
		}), StatusCodes.FORBIDDEN, Refresh_UsedTokenError
	);
	const tokens = generateTokens(payload.ownerUsername);
	await prisma.refreshToken.create({
		data: {
			token: tokens.refreshToken,
			ownerUsername: payload.ownerUsername
		}
	});

	return res.status(StatusCodes.OK).send(tokens);
}));

export default router;