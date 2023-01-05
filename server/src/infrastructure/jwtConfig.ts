import fastifyJwt from "@fastify/jwt";
import { Role, User } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { onRequestHookHandler } from "fastify/types/hooks";
import { StatusCodes } from "http-status-codes";
import { General_Unauthorized } from "../../../shared/consts/error";
import { ApplicationError } from "./applicationErrorHandler";


declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: {
			username: User["username"];
			role: Role
		};
		user: Pick<User, "username" | "role">;
	}
}

export const jwtConfig = async (instance: FastifyInstance) => {
	if (!process.env.JWT_SECRET)
		throw new Error(`process.env.JWT_SECRET is required`);

	instance.register(fastifyJwt, {
		secret: process.env.JWT_SECRET
	});
};

export const optionalJwtOnRequestHook: onRequestHookHandler = async (request) => {
	if (!request.headers["authorization"])
		return;

	// @ts-ignore
	await jwtOnRequestHook(request);
};

export const jwtOnRequestHook: onRequestHookHandler = async (request) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		throw new ApplicationError(StatusCodes.UNAUTHORIZED, General_Unauthorized);
	}
};