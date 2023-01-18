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
					token: Number(body.token)
				}
			}),
			StatusCodes.BAD_REQUEST, VerifyEmail_WrongToken
		);
		await prisma.user.create({
			data: {
				username: registerToken.username,
				email: registerToken.email,
				passwordHash: registerToken.passwordHash
			}
		});

		return reply.status(StatusCodes.OK).send();
	});
};