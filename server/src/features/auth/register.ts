import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { RegisterBasePath, RegisterRequest, RegisterResponse } from "../../../../shared/endpoints/auth/register";
import { prisma } from "../../infrastructure/prismaConnect";
import { generateTokens, hashPassword } from "./services";


export const register = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: RegisterResponse,
		Body: RegisterRequest
	}>(RegisterBasePath, async (request, reply) => {
		const body = request.body;

		const hash = await hashPassword(body.password);
		const tokens = generateTokens(body.username);
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