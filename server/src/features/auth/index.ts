import { FastifyPluginAsync } from "fastify/types/plugin";
import { StatusCodes } from "http-status-codes";
import {
	Login_WrongPasswordError,
	Login_WrongUsernameError,
	Refresh_UsedTokenError,
	Refresh_WrongTokenError
} from "../../../../shared/consts/error";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { RefreshBasePath, RefreshRequest, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { initializeServices } from "./services";


const module: FastifyPluginAsync = async (instance) => {
	const services = initializeServices(instance.jwt);

	instance.post<{
		Reply: RegisterResponse,
		Body: RegisterRequest
	}>(RegisterBasePath, async (request, reply) => {
		const body = request.body;

		const hash = await services.hashPassword(body.password);
		const tokens = services.generateTokens(body.username);
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

		return reply.status(StatusCodes.CREATED).send(tokens);
	});

	instance.post<{
		Reply: LoginResponse,
		Body: LoginRequest
	}>(LoginBasePath, async (request, reply) => {
		const body = request.body;

		const user = await cancelIfFailed(() => services.getUserByUsername(body.username),
			StatusCodes.FORBIDDEN, Login_WrongUsernameError
		);
		await cancelIfFailed(() => services.comparePassword(body.password, user.passwordHash),
			StatusCodes.FORBIDDEN, Login_WrongPasswordError
		);

		const tokens = services.generateTokens(body.username);
		await prisma.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				ownerUsername: body.username
			}
		});

		return reply.status(StatusCodes.OK).send(tokens);
	});

	instance.post<{
		Reply: RefreshResponse,
		Body: RefreshRequest
	}>(RefreshBasePath, async (request, reply) => {
		const body = request.body;

		const payload = await cancelIfFailed(async () => services.decodeToken(body.refreshToken),
			StatusCodes.FORBIDDEN, Refresh_WrongTokenError
		);

		await cancelIfFailed(() =>
			prisma.refreshToken.delete({
				where: {
					token: body.refreshToken
				}
			}), StatusCodes.FORBIDDEN, Refresh_UsedTokenError
		);
		const tokens = services.generateTokens(payload.username);
		await prisma.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				ownerUsername: payload.username
			}
		});

		reply.status(StatusCodes.OK).send(tokens);
	});
};

export default module;