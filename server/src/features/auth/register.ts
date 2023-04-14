import { User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Register_EmailInUseError, Register_UsernameInUseError } from "../../../../shared/consts/error";
import {
	RegisterBasePath,
	RegisterRequest,
	RegisterRequestValidator,
	RegisterResponse
} from "../../../../shared/endpoints/auth/register";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
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

		const existed = await prisma.user.findFirst({
			where: {
				OR: [
					{ username: body.username },
					{ email: body.email }
				]
			}
		});
		if (existed) {
			const fieldsToCheck = [
				{ name: "username", message: Register_UsernameInUseError },
				{ name: "email", message: Register_EmailInUseError }
			] satisfies {
				name: keyof User,
				message: string
			}[];

			for (let field of fieldsToCheck) {
				const origin = existed[field.name];

				if (!origin || origin === body[field.name])
					throw new ApplicationError(StatusCodes.BAD_REQUEST, field.message);
			}
		}

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
				username: body.username
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