import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ConfirmResetPassword_WrongToken } from "../../../../shared/consts/error";
import {
	ConfirmResetPasswordBasePath,
	ConfirmResetPasswordRequest,
	ConfirmResetPasswordResponse,
	ConfirmResetPasswordValidator
} from "../../../../shared/endpoints/auth/confirmResetPassword";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { hashPassword } from "./services";


export const confirmResetPassword = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: ConfirmResetPasswordResponse,
		Body: ConfirmResetPasswordRequest
	}>(ConfirmResetPasswordBasePath, {
		preValidation: [validatePreValidationHook({ body: ConfirmResetPasswordValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const changerToken = await cancelIfFailed(async () => await prisma.passwordChangerTokens.delete({
				where: {
					id: Number(body.token)
				}
			}),
			StatusCodes.BAD_REQUEST, ConfirmResetPassword_WrongToken
		);
		const hash = await hashPassword(body.password);
		await prisma.user.update({
			where: {
				email: changerToken.email
			},
			data: {
				passwordHash: hash
			}
		});

		reply.status(StatusCodes.OK).send();
	});
};