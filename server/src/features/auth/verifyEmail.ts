import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { VerifyEmail_WrongToken } from "../../../../shared/consts/error";
import {
	VerifyEmailBasePath,
	VerifyEmailRequest,
	VerifyEmailRequestValidator,
	VerifyEmailResponse
} from "../../../../shared/endpoints/auth/verifyEmail";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { generateTokens } from "./services";


export const verifyEmail = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: VerifyEmailResponse,
		Body: VerifyEmailRequest
	}>(VerifyEmailBasePath, {
		preValidation: [validatePreValidationHook({ body: VerifyEmailRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const registerToken = await cancelIfFailed(async () => await prisma.registerTokens.delete({
				where: {
					id: Number(body.token)
				}
			}),
			StatusCodes.BAD_REQUEST, VerifyEmail_WrongToken
		);
		const tokens = generateTokens(registerToken.username, "USER");
		await prisma.user.create({
			data: {
				username: registerToken.username,
				email: registerToken.email,
				passwordHash: registerToken.passwordHash,
				tokens: {
					create: {
						token: tokens.refreshToken
					}
				}
			}
		});
		await prisma.registerTokens.deleteMany({
			where: {
				email: registerToken.email
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};