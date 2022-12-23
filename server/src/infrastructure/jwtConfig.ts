import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { onRequestHookHandler } from "fastify/types/hooks";
import { StatusCodes } from "http-status-codes";
import { General_Unauthorized } from "../../../shared/consts/error";
import { ApplicationError } from "./applicationErrorHandler";


declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: {
			username: string;
		};
		user: {
			id: string,
			username: string;
		};
	}
}

export default async function (instance: FastifyInstance) {
	if (!process.env.JWT_SECRET)
		throw new Error(`process.env.JWT_SECRET is required`);

	instance.register(fastifyJwt, {
		secret: process.env.JWT_SECRET
	});
};

export const jwtMiddleware: onRequestHookHandler = async function (request, reply, done) {
	try {
		await request.jwtVerify();
	} catch (err) {
		throw new ApplicationError(StatusCodes.UNAUTHORIZED, General_Unauthorized);
	}
};