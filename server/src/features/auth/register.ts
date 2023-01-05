import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import {
	RegisterBasePath,
	RegisterRequest,
	RegisterRequestValidator,
	RegisterResponse
} from "../../../../shared/endpoints/auth/register";
import { prisma } from "../../infrastructure/prismaConnect";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { generateTokens, hashPassword } from "./services";


export const register = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: RegisterResponse,
		Body: RegisterRequest
	}>(RegisterBasePath, {
		preValidation: [validatePreValidationHook({ body: RegisterRequestValidator })]
	}, async (request, reply) => {
		const body = request.body;

		const hash = await hashPassword(body.password);
		const tokens = generateTokens(body.username, "USER");
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
};