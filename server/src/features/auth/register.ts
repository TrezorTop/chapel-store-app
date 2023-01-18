import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	RegisterBasePath,
	RegisterRequest,
	RegisterRequestValidator,
	RegisterResponse
} from "../../../../shared/endpoints/auth/register";
import { prisma } from "../../infrastructure/prismaConnect";
import { mailSender } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { generateNumberToken, hashPassword } from "./services";


export const register = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: RegisterResponse,
		Body: RegisterRequest
	}>(RegisterBasePath, {
		preValidation: [validatePreValidationHook({ body: RegisterRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const hash = await hashPassword(body.password);
		const token = generateNumberToken();
		await prisma.registerTokens.upsert({
			create: {
				token: token,
				username: body.username,
				email: body.email,
				passwordHash: hash,
			},
			update: {
				token: token,
				username: body.username,
				email: body.email,
				passwordHash: hash,
			},
			where: {
				username: body.username,
				email: body.email,
			}
		});
		await mailSender.sendMail({
			from: process.env.GMAIL_MAIL,
			subject: "Email Confirmation",
			to: body.email,
			text: `
Hello, ${body.username}!

To verify your e-mail address, please use this key
				
${token}
			`
		});

		return reply.status(StatusCodes.OK).send();
	});
};