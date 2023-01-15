import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { RequestResetPassword_UserDoesNotExists } from "../../../../shared/consts/error";
import {
	RequestResetPasswordBasePath,
	RequestResetPasswordRequest,
	RequestResetPasswordRequestValidator,
	RequestResetPasswordResponse
} from "../../../../shared/endpoints/auth/requestResetPassword";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, mailSender } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { getUserByUsername } from "./services";


export const requestResetPassword = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: RequestResetPasswordResponse,
		Body: RequestResetPasswordRequest
	}>(RequestResetPasswordBasePath, {
		preValidation: [validatePreValidationHook({ body: RequestResetPasswordRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const user = await cancelIfFailed(() => getUserByUsername(body.email),
			StatusCodes.NOT_FOUND, RequestResetPassword_UserDoesNotExists
		);

		const id = Math.floor(Math.random() * 899999 + 100000);
		await prisma.passwordChangerTokens.create({
			data: {
				id: id,
				email: body.email
			}
		});

		await mailSender.sendMail({
			from: process.env.GMAIL_MAIL,
			to: body.email,
			text: `
Hello, ${user.username}!

To verify your e-mail address, please use this key
				
${id}
			`
		});

		reply.status(StatusCodes.OK).send();
	});
};