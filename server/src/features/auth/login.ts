import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Login_WrongPasswordError, Login_WrongUsernameError } from "../../../../shared/consts/error";
import { LoginBasePath, LoginRequest, LoginResponse } from "../../../../shared/endpoints/auth/login";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { comparePassword, generateTokens, getUserByUsername } from "./services";


export const login = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: LoginResponse,
		Body: LoginRequest
	}>(LoginBasePath, async (request, reply) => {
		const body = request.body;

		const user = await cancelIfFailed(() => getUserByUsername(body.username),
			StatusCodes.FORBIDDEN, Login_WrongUsernameError
		);
		await cancelIfFailed(() => comparePassword(body.password, user.passwordHash),
			StatusCodes.FORBIDDEN, Login_WrongPasswordError
		);

		const tokens = generateTokens(body.username, user.role);
		await prisma.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				ownerUsername: body.username
			}
		});

		return reply.status(StatusCodes.OK).send(tokens);
	});
};