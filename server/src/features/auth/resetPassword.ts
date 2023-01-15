import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	ResetPasswordBasePath,
	ResetPasswordRequest,
	ResetPasswordResponse
} from "../../../../shared/endpoints/auth/resetPassword";
import { mailSender } from "../../infrastructure/utils";


export const resetPassword = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: ResetPasswordResponse,
		Body: ResetPasswordRequest
	}>(ResetPasswordBasePath, async (request, reply) => {
		const body = request.body;

		await mailSender.sendMail({
			from: process.env.GMAIL_MAIL,
			to: body.email,
			text: "Hello nigerok"
		});

		reply.status(StatusCodes.OK).send();
	});
};