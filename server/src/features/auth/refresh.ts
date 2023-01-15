import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Refresh_UsedTokenError, Refresh_WrongTokenError } from "../../../../shared/consts/error";
import { RefreshBasePath, RefreshRequest, RefreshResponse } from "../../../../shared/endpoints/auth/refresh";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { UserJwt } from "./index";
import { decodeToken, generateTokens } from "./services";


export const refresh = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: RefreshResponse,
		Body: RefreshRequest
	}>(RefreshBasePath, async (request, reply) => {
		const body = request.body;

		const payload = await cancelIfFailed(async () => decodeToken<UserJwt>(body.refreshToken),
			StatusCodes.FORBIDDEN, Refresh_WrongTokenError
		);

		await cancelIfFailed(() => prisma.refreshToken.delete({
				where: {
					token: body.refreshToken
				}
			}), StatusCodes.FORBIDDEN, Refresh_UsedTokenError
		);
		const tokens = generateTokens(payload.username, payload.role);
		await prisma.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				ownerUsername: payload.username
			}
		});

		reply.status(StatusCodes.OK).send(tokens);
	});
};